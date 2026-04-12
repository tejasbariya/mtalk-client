import { useStore } from '../store/useStore';
import { Edit3, Activity, BarChart2 } from 'lucide-react';

export default function Profile() {
  const user = useStore(state => state.user);

  if (!user) return (
    <div style={{ textAlign: 'center', paddingTop: 80, color: 'var(--text-muted)' }}>
      Please <strong style={{ color: 'var(--blue-neon)' }}>sign in</strong> to view your profile.
    </div>
  );

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Banner */}
      <div style={{
        height: 'clamp(140px, 18vw, 200px)',
        borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
        background: 'linear-gradient(135deg, #0d1b3e 0%, #1e1b4b 40%, #1a1208 100%)',
        border: '1px solid var(--border-dim)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative glow circles */}
        <div style={{ position: 'absolute', top: '-30px', right: '10%', width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '-20px', left: '15%', width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)' }} />
        <button style={{ position: 'absolute', top: 16, right: 16, background: 'var(--glass-bg)', border: '1px solid var(--border-muted)', borderRadius: 'var(--radius-md)', padding: '8px 14px', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '13px', fontWeight: 600, backdropFilter: 'blur(12px)' }}>
          Edit Profile
        </button>
      </div>

      {/* Avatar section */}
      <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-dim)', borderRadius: '0 0 var(--radius-xl) var(--radius-xl)', padding: '0 clamp(16px, 3vw, 32px) 24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'clamp(12px, 3vw, 24px)', transform: 'translateY(-40px)', marginBottom: '-16px' }}>
          {/* Avatar */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
              style={{ width: 'clamp(80px, 10vw, 120px)', height: 'clamp(80px, 10vw, 120px)', borderRadius: '50%', border: '4px solid var(--bg-elevated)', objectFit: 'cover', background: 'var(--bg-card)', boxShadow: 'var(--shadow-blue)' }} alt="avatar" />
            <button style={{ position: 'absolute', bottom: 4, right: 4, width: 28, height: 28, borderRadius: '50%', background: 'var(--blue-bright)', border: '2px solid var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Edit3 size={13} color="#fff" />
            </button>
          </div>

          {/* Name & Karma */}
          <div style={{ paddingBottom: 4 }}>
            <h1 style={{ fontSize: 'clamp(18px, 3vw, 28px)', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, marginBottom: 4 }}>{user.username}</h1>
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
            <p style={{ fontSize: '14px', color: user.bio ? 'var(--text-secondary)' : 'var(--text-dim)', lineHeight: 1.6 }}>
              {user.bio || "No bio yet. Add something about yourself!"}
            </p>
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
