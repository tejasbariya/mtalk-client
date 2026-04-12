import { useStore } from '../store/useStore';
import { Library as LibIcon, RefreshCw, Upload, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const TABS = ['Reading', 'Plan to Read', 'Completed', 'On Hold', 'Dropped'];
const TAB_COLORS = {
  'Reading': { color: 'var(--blue-neon)', bg: 'var(--blue-subtle)', border: 'var(--border-blue)' },
  'Plan to Read': { color: 'var(--gray-200)', bg: 'var(--glass-bg)', border: 'var(--border-muted)' },
  'Completed': { color: 'var(--green-neon)', bg: 'var(--green-subtle)', border: 'var(--border-green)' },
  'On Hold': { color: 'var(--gold-warm)', bg: 'var(--gold-subtle)', border: 'var(--border-gold)' },
  'Dropped': { color: 'var(--crimson-warm)', bg: 'var(--crimson-subtle)', border: 'var(--border-crimson)' },
};

export default function Library() {
  const user = useStore(state => state.user);

  if (!user) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', textAlign: 'center', gap: 16 }}>
      <LibIcon size={56} style={{ color: 'var(--blue-neon)', opacity: 0.5 }} />
      <h2 style={{ fontSize: '1.5rem', fontFamily: 'Space Grotesk, sans-serif' }}>Your Personal Library</h2>
      <p style={{ color: 'var(--text-muted)', maxWidth: 360, lineHeight: 1.6, fontSize: 14 }}>
        Track all your reading, completed, and planned manhwa in one beautiful place. Connect your MAL or AniList account to import.
      </p>
      <button className="btn-primary" style={{ marginTop: 8 }}>Sign In to Access</button>
    </div>
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, marginBottom: '28px', borderBottom: '1px solid var(--border-dim)', paddingBottom: '24px' }}>
        <div>
          <h1 className="section-heading" style={{ marginBottom: 6 }}>
            <LibIcon size={22} color="var(--blue-bright)" /> My Library
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Tracking 0 titles across 5 statuses</p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link to="/settings">
            <button className="btn-ghost" style={{ fontSize: 13, height: 40, padding: '0 18px' }}><Upload size={15} /> Import MAL</button>
          </Link>
          <button className="btn-primary" style={{ fontSize: 13, height: 40, padding: '0 18px' }}><RefreshCw size={15} /> Sync</button>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '12px', marginBottom: '28px' }}>
        {[['0', 'Reading', 'var(--blue-neon)'], ['0', 'Completed', 'var(--green-neon)'], ['0', 'On Hold', 'var(--gold-warm)'], ['0', 'Dropped', 'var(--crimson-warm)'], ['0', 'Planned', 'var(--gray-300)']].map(([count, label, color]) => (
          <div key={label} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-dim)', borderRadius: 'var(--radius-md)', padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', color }}>{count}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: 4, marginBottom: '24px' }} className="hide-scrollbar">
        {TABS.map((tab, i) => {
          const style = TAB_COLORS[tab];
          return (
            <button key={tab} style={{
              padding: '8px 18px', borderRadius: 'var(--radius-full)', fontSize: '13px', fontWeight: 600,
              whiteSpace: 'nowrap', cursor: 'pointer', transition: 'var(--transition-base)',
              background: i === 0 ? style.bg : 'transparent',
              color: i === 0 ? style.color : 'var(--text-muted)',
              border: `1px solid ${i === 0 ? style.border : 'var(--border-dim)'}`,
              boxShadow: i === 0 ? `0 0 12px ${style.bg}` : 'none',
            }}>
              {tab}
            </button>
          );
        })}
      </div>

      {/* Empty State */}
      <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-dim)', borderRadius: 'var(--radius-xl)', padding: '60px 32px', textAlign: 'center' }}>
        <BarChart2 size={44} style={{ opacity: 0.15, display: 'block', margin: '0 auto 16px', color: 'var(--blue-neon)' }} />
        <p style={{ fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>Your Reading list is empty</p>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>Start tracking your manhwa progress today.</p>
        <Link to="/discover"><button className="btn-primary" style={{ fontSize: 13 }}>Discover Titles</button></Link>
      </div>
    </div>
  );
}
