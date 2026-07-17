import { Settings as SettingsIcon, Upload, Bell, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { deleteAccount, updateProfile, batchAddLibrary } from '../api/apiClient';
import { toast } from '../components/ToastProvider.jsx';

export default function Settings() {
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const logout = useStore((state) => state.logout);
  const navigate = useNavigate();

  // Handle Logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Handle Delete Account 
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you absolutely sure? This will permanently delete your account and cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      await deleteAccount();
      logout();
      navigate('/');
      toast.success('Your account has been deleted.');
    } catch (err) {
      console.error("Failed to delete account:", err);
      toast.error('Failed to delete account. Please try again.');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target.result;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, "text/xml");
        const animes = xmlDoc.getElementsByTagName("anime");

        const entries = [];
        for (let i = 0; i < animes.length; i++) {
          const anime = animes[i];
          const titleId = anime.getElementsByTagName("series_animedb_id")[0]?.textContent;
          const title = anime.getElementsByTagName("series_title")[0]?.textContent;
          const coverImage = anime.getElementsByTagName("series_image")[0]?.textContent || '';
          const myStatus = anime.getElementsByTagName("my_status")[0]?.textContent;

          let status = 'Plan to Read';
          if (myStatus === 'Completed') status = 'Completed';
          else if (myStatus === 'Watching' || myStatus === 'Reading') status = 'Reading';
          else if (myStatus === 'On Hold') status = 'On Hold';
          else if (myStatus === 'Dropped') status = 'Dropped';

          if (titleId && title) {
            entries.push({ titleId, title, coverImage, status, titleStatus: 'Finished', source: 'MAL' });
          }
        }

        if (entries.length > 0) {
          toast.success(`Found ${entries.length} entries. Importing...`);
          const res = await batchAddLibrary({ entries });
          toast.success(res.data.message || 'Import successful!');
        } else {
          toast.error('No valid entries found in XML.');
        }
      } catch (err) {
        console.error('Upload failed', err);
        toast.error('Upload failed');
      } finally {
        e.target.value = null;
      }
    };
    reader.readAsText(file);
  };

  const handleNotificationToggle = async (key, currentValue) => {
    try {
      const newSettings = {
        notifications: {
          ...user?.settings?.notifications,
          [key]: !currentValue
        }
      };
      const res = await updateProfile({ settings: newSettings });
      setUser(res.data.user);
      toast.success('Settings updated');
    } catch (err) {
      toast.error('Failed to update settings');
    }
  };

  const notifications = [
    { key: 'newChapterReleases', label: 'New Chapter Releases', desc: 'Get notified when a new chapter drops for your library titles', defaultOn: true },
    { key: 'friendRequests', label: 'Friend Requests', desc: 'When someone sends you a friend request', defaultOn: true },
    { key: 'karmaMilestones', label: 'Karma Milestones', desc: 'When your karma reaches a new milestone', defaultOn: true },
    { key: 'chatMentions', label: 'Chat Mentions', desc: 'When someone @mentions you in a chat', defaultOn: true },
    { key: 'hiatusAlerts', label: 'Hiatus Alerts', desc: 'When a title in your library goes on hiatus', defaultOn: false },
  ];

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      <h1 className="section-heading" style={{ marginBottom: '28px' }}>
        <SettingsIcon size={22} color="var(--blue-bright)" /> Settings
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* MAL Import */}
        <div style={{ background: 'var(--bg-elevated)', borderLeft: '3px solid var(--gold-bright)', border: '1px solid var(--border-gold)', borderRadius: 'var(--radius-xl)', padding: '24px', boxShadow: '0 0 20px rgba(245,158,11,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Upload size={18} color="var(--gold-warm)" />
            <h2 style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif' }}>Import from MyAnimeList</h2>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.6 }}>
            Export your MAL library as XML and upload it here to import your entire collection into MTalk.
          </p>
          <label style={{ display: 'block', border: '2px dashed var(--border-gold)', borderRadius: 'var(--radius-lg)', padding: '32px', textAlign: 'center', cursor: 'pointer', background: 'var(--gold-subtle)', transition: 'var(--transition-base)' }}>
            <Upload size={28} color="var(--gold-warm)" style={{ display: 'block', margin: '0 auto 10px', opacity: 0.6 }} />
            <p style={{ fontWeight: 600, color: 'var(--gold-warm)', marginBottom: 4, fontSize: '14px' }}>Drop your MAL XML file here</p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>or click to browse files</p>
            <input type="file" accept=".xml" style={{ display: 'none' }} onChange={handleFileUpload} />
          </label>
        </div>

        {/* Notifications */}
        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-dim)', borderRadius: 'var(--radius-xl)', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Bell size={18} color="var(--green-neon)" />
            <h2 style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif' }}>Notifications</h2>
          </div>
          {notifications.map(({ key, label, desc, defaultOn }) => {
            const isChecked = user?.settings?.notifications?.[key] ?? defaultOn;
            return (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--border-dim)' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '2px' }}>{label}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{desc}</div>
                </div>
                <label style={{ position: 'relative', width: 44, height: 24, flexShrink: 0, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleNotificationToggle(key, isChecked)}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute', inset: 0, borderRadius: 12,
                    background: isChecked ? 'var(--blue-bright)' : 'var(--gray-700)',
                    transition: 'var(--transition-base)',
                    boxShadow: isChecked ? '0 0 8px var(--blue-glow)' : 'none',
                  }}>
                    <span style={{ position: 'absolute', top: 3, left: isChecked ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'var(--transition-base)' }} />
                  </span>
                </label>
              </div>
            );
          })}
        </div>

        {/* Security */}
        <div style={{ background: 'var(--crimson-subtle)', border: '1px solid var(--border-crimson)', borderRadius: 'var(--radius-xl)', padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Shield size={17} color="var(--crimson-warm)" />
            <h2 style={{ fontSize: '15px', fontWeight: 700 }}>Danger Zone</h2>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px' }}>
            Log out of your current session or permanently delete your account and all your data.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button onClick={handleLogout} style={{ padding: '8px 20px', borderRadius: 'var(--radius-full)', background: 'transparent', border: '1px solid var(--text-muted)', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'var(--transition-base)' }}>
              Log Out
            </button>
            <button onClick={handleDeleteAccount} style={{ padding: '8px 20px', borderRadius: 'var(--radius-full)', background: 'var(--crimson-subtle)', border: '1px solid var(--border-crimson)', color: 'var(--crimson-warm)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'var(--transition-base)' }}>
              Delete Account
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
