import { Settings as SettingsIcon, Upload, Bell, User, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { deleteAccount } from '../api/apiClient'; 
import { toast } from '../components/ToastProvider.jsx'; 

export default function Settings() {
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
  }
};

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
            <input type="file" accept=".xml" style={{ display: 'none' }} />
          </label>
        </div>

        {/* Profile */}
        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-dim)', borderRadius: 'var(--radius-xl)', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <User size={18} color="var(--blue-neon)" />
            <h2 style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif' }}>Profile</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Username</label>
              <input className="input-base" placeholder="your username" />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Bio</label>
              <textarea className="input-base" rows={3} placeholder="Tell the community about yourself..." style={{ resize: 'vertical', lineHeight: 1.6 }} />
            </div>
            <button className="btn-primary" style={{ alignSelf: 'flex-start', fontSize: 13 }}>Save Changes</button>
          </div>
        </div>

        {/* Notifications */}
        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-dim)', borderRadius: 'var(--radius-xl)', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Bell size={18} color="var(--green-neon)" />
            <h2 style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif' }}>Notifications</h2>
          </div>
          {[
            ['New Chapter Releases', 'Get notified when a new chapter drops for your library titles', true],
            ['Friend Requests', 'When someone sends you a friend request', true],
            ['Karma Milestones', 'When your karma reaches a new milestone', true],
            ['Chat Mentions', 'When someone @mentions you in a chat', true],
            ['Hiatus Alerts', 'When a title in your library goes on hiatus', false],
          ].map(([label, desc, defaultOn]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--border-dim)' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '2px' }}>{label}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{desc}</div>
              </div>
              <label style={{ position: 'relative', width: 44, height: 24, flexShrink: 0, cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked={defaultOn} style={{ opacity: 0, width: 0, height: 0 }} />
                <span style={{
                  position: 'absolute', inset: 0, borderRadius: 12,
                  background: defaultOn ? 'var(--blue-bright)' : 'var(--gray-700)',
                  transition: 'var(--transition-base)',
                  boxShadow: defaultOn ? '0 0 8px var(--blue-glow)' : 'none',
                }}>
                  <span style={{ position: 'absolute', top: 3, left: defaultOn ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'var(--transition-base)' }} />
                </span>
              </label>
            </div>
          ))}
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
