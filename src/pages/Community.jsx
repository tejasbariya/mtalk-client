import { useStore } from '../store/useStore';
import { Activity, UserPlus, Search, Users } from 'lucide-react';

export default function Community() {
  const user = useStore(state => state.user);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 280px', gap: 24 }} className="community-grid">
      {/* Activity Feed */}
      <div>
        <h1 className="section-heading" style={{ marginBottom: '24px' }}>
          <Activity size={22} color="var(--gold-warm)" /> Friend Activity
        </h1>
        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-dim)', borderRadius: 'var(--radius-xl)', padding: '48px 32px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Users size={48} style={{ opacity: 0.15, display: 'block', margin: '0 auto 16px' }} />
          <p style={{ fontWeight: 600, marginBottom: 8 }}>No activity yet</p>
          <p style={{ fontSize: '13px' }}>Add friends to watch their library updates, reviews, and posts here.</p>
        </div>
      </div>

      {/* Friends Panel */}
      <div>
        <h2 className="section-heading" style={{ marginBottom: '24px', fontSize: '18px' }}>
          <UserPlus size={18} color="var(--blue-bright)" /> Friends
        </h2>
        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-dim)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-dim)', position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 28, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="input-base" style={{ paddingLeft: 36, height: 38, fontSize: 13, borderRadius: 'var(--radius-md)' }} placeholder="Search users…" />
          </div>
          <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '13px' }}>
            You haven't added any friends yet.
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 720px) { .community-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
