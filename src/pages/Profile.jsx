import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Edit3, Activity, BarChart2, Loader2, X } from 'lucide-react';
import { updateProfile } from '../api/apiClient';
import { toast } from '../components/ToastProvider.jsx';

export default function Profile() {
  const user = useStore(state => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ 
    username: user?.username || '', 
    bio: user?.bio || '',
    avatar: user?.avatar || '',
    banner: user?.banner || ''
  });
  const [loading, setLoading] = useState(false);

  if (!user) return (
    <div style={{ textAlign: 'center', paddingTop: 80, color: 'var(--text-muted)' }}>
      Please <strong style={{ color: 'var(--blue-neon)' }}>sign in</strong> to view your profile.
    </div>
  );

  const handleSave = async () => {
    if (!form.username.trim()) return toast.error('Username is required');
    setLoading(true);
    try {
      const res = await updateProfile(form);
      // Update store using setAuth while keeping token
      useStore.getState().setAuth(res.data.user, useStore.getState().token);
      setIsEditing(false);
      toast.success('Successfully updated your profile!');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({ 
      username: user.username, 
      bio: user.bio || '',
      avatar: user.avatar || '',
      banner: user.banner || ''
    });
    setIsEditing(false);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Banner */}
      <div style={{
        height: 'clamp(140px, 18vw, 200px)',
        borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
        background: isEditing
          ? (form.banner ? `url(${form.banner}) center/cover no-repeat` : 'linear-gradient(135deg, #0d1b3e 0%, #1e1b4b 40%, #1a1208 100%)')
          : (user.banner ? `url(${user.banner}) center/cover no-repeat` : 'linear-gradient(135deg, #0d1b3e 0%, #1e1b4b 40%, #1a1208 100%)'),
        border: '1px solid var(--border-dim)',
        position: 'relative', overflow: 'hidden',
        transition: 'var(--transition-base)'
      }}>
        {/* Decorative glow circles */}
        <div style={{ position: 'absolute', top: '-30px', right: '10%', width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '-20px', left: '15%', width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)' }} />
        
        {isEditing && (
          <div 
            style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', zIndex: 10 }}
          >
            <div style={{ width: '90%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: 6, padding: '20px', background: 'rgba(0,0,0,0.6)', borderRadius: 'var(--radius-lg)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Banner URL</label>
              <input 
                value={form.banner}
                onChange={e => setForm({...form, banner: e.target.value})}
                className="input-base"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px' }}
                placeholder="Paste banner image URL..."
              />
            </div>
          </div>
        )}

        <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 10, zIndex: 20 }}>
          {isEditing && (
            <button 
              onClick={handleCancel}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-dim)', borderRadius: 'var(--radius-md)', padding: '8px 14px', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, backdropFilter: 'blur(12px)' }}
            >
              <X size={14} /> Cancel
            </button>
          )}
          <button 
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            disabled={loading}
            style={{ 
              background: isEditing ? 'var(--blue-bright)' : 'var(--glass-bg)', 
              border: '1px solid var(--border-muted)', 
              borderRadius: 'var(--radius-md)', 
              padding: '8px 14px', 
              color: isEditing ? '#fff' : 'var(--text-secondary)', 
              cursor: 'pointer', 
              fontSize: '13px', 
              fontWeight: 600, 
              backdropFilter: 'blur(12px)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'var(--transition-base)',
              boxShadow: isEditing ? '0 0 15px rgba(59,130,246,0.5)' : 'none'
            }}
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : isEditing ? 'Save Profile' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {/* Profile Picture section */}
      <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-dim)', borderRadius: '0 0 var(--radius-xl) var(--radius-xl)', padding: '0 clamp(16px, 3vw, 32px) 24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'clamp(12px, 3vw, 24px)', transform: 'translateY(-40px)', marginBottom: '-16px' }}>
          {/* Profile Picture */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <img src={isEditing ? (form.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${form.username}`) : (user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`)}
              style={{ width: 'clamp(80px, 10vw, 120px)', height: 'clamp(80px, 10vw, 120px)', borderRadius: '50%', border: '4px solid var(--bg-elevated)', objectFit: 'cover', background: 'var(--bg-card)', boxShadow: 'var(--shadow-blue)' }} alt="profile picture" />
            {isEditing && (
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '12px', backdropFilter: 'blur(4px)', zIndex: 5 }}>
                <Edit3 size={16} color="#fff" style={{ marginBottom: 4, opacity: 0.8 }} />
                <input 
                  value={form.avatar}
                  onChange={e => setForm({...form, avatar: e.target.value})}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px', padding: '4px 6px', color: '#fff', fontSize: '10px', textAlign: 'center' }}
                  placeholder="Paste URL..."
                />
              </div>
            )}
          </div>

          {/* Name & Karma */}
          <div style={{ paddingBottom: 4, flex: 1 }}>
            {isEditing ? (
              <input 
                className="input-base" 
                value={form.username} 
                onChange={e => setForm({...form, username: e.target.value})}
                style={{ fontSize: '20px', fontWeight: 700, width: '100%', marginBottom: 8, padding: '8px 12px' }}
                placeholder="Enter username..."
              />
            ) : (
              <h1 style={{ fontSize: 'clamp(18px, 3vw, 28px)', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, marginBottom: 4 }}>{user.username}</h1>
            )}
            <span className="karma-badge" style={{ fontSize: '13px', padding: '4px 12px' }}>{user.karma || 0} Karma</span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'clamp(200px, 28%, 260px) minmax(0,1fr)', gap: '20px' }} className="profile-grid">
        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-dim)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
            <h4 style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>About</h4>
            {isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>BIO</label>
                  <textarea 
                    className="input-base" 
                    rows={4} 
                    value={form.bio} 
                    onChange={e => setForm({...form, bio: e.target.value})}
                    style={{ fontSize: '14px', width: '100%', padding: '10px', resize: 'vertical' }}
                    placeholder="Tell the community about yourself..."
                  />
                </div>
              </div>
            ) : (
              <p style={{ fontSize: '14px', color: user.bio ? 'var(--text-secondary)' : 'var(--text-dim)', lineHeight: 1.6 }}>
                {user.bio || "No bio yet. Add something about yourself!"}
              </p>
            )}
          </div>

          <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-dim)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
            <h4 style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '14px' }}>Stats</h4>
            {[['Total Read', '0', 'var(--blue-neon)'], ['Reviews', '0', 'var(--gold-warm)'], ['Friends', '0', 'var(--green-neon)'], ['Karma', user.karma || '0', 'var(--crimson-warm)']].map(([k, v, c]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border-dim)', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-muted)' }}>{k}</span>
                <span style={{ fontWeight: 700, color: c }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity */}
        <div>
          <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-dim)', borderRadius: 'var(--radius-xl)', padding: '24px', height: '100%', minHeight: 260 }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, borderBottom: '1px solid var(--border-dim)', paddingBottom: 16 }}>
              <Activity size={17} color="var(--blue-bright)" /> Recent Activity
            </h3>
            <div style={{ textAlign: 'center', paddingTop: 40, color: 'var(--text-dim)', fontSize: 14 }}>
              <BarChart2 size={36} style={{ opacity: 0.15, display: 'block', margin: '0 auto 12px' }} />
              <p>No activity yet. Start reviewing and tracking!</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) { .profile-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
