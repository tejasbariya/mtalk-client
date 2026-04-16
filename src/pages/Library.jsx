import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useStore } from '../store/useStore';
import { getLibrary } from '../api/apiClient';
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
  const [activeTab, setActiveTab] = useState(TABS[0]);

  const { data: entries, isLoading } = useQuery({
    queryKey: ['library'],
    queryFn: async () => (await getLibrary()).data,
    enabled: !!user
  });

  if (!user) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', textAlign: 'center', gap: 16 }}>
      <LibIcon size={56} style={{ color: 'var(--blue-neon)', opacity: 0.5 }} />
      <h2 style={{ fontSize: '1.5rem', fontFamily: 'Space Grotesk, sans-serif' }}>Your Personal Library</h2>
      <p style={{ color: 'var(--text-muted)', maxWidth: 360, lineHeight: 1.6, fontSize: 14 }}>
        Track all your reading, completed, and planned manhwa in one beautiful place. Connect your MAL or AniList account to import.
      </p>
      <Link to="/login"><button className="btn-primary" style={{ marginTop: 8 }}>Sign In to Access</button></Link>
    </div>
  );

  const filteredEntries = entries?.filter(e => e.status === activeTab) || [];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, marginBottom: '28px', borderBottom: '1px solid var(--border-dim)', paddingBottom: '24px' }}>
        <div>
          <h1 className="section-heading" style={{ marginBottom: 6 }}>
            <LibIcon size={22} color="var(--blue-bright)" /> My Library
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Tracking {entries?.length || 0} titles across 5 statuses</p>
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
        {[
          [entries?.filter(e => e.status === 'Reading').length || 0, 'Reading', 'var(--blue-neon)'],
          [entries?.filter(e => e.status === 'Completed').length || 0, 'Completed', 'var(--green-neon)'],
          [entries?.filter(e => e.status === 'On Hold').length || 0, 'On Hold', 'var(--gold-warm)'],
          [entries?.filter(e => e.status === 'Dropped').length || 0, 'Dropped', 'var(--crimson-warm)'],
          [entries?.filter(e => e.status === 'Plan to Read').length || 0, 'Planned', 'var(--gray-300)']
        ].map(([count, label, color]) => (
          <div key={label} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-dim)', borderRadius: 'var(--radius-md)', padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', color }}>{count}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: 4, marginBottom: '24px' }} className="hide-scrollbar">
        {TABS.map((tab) => {
          const style = TAB_COLORS[tab];
          const isActive = tab === activeTab;
          return (
            <button key={tab} 
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 18px', borderRadius: 'var(--radius-full)', fontSize: '13px', fontWeight: 600,
                whiteSpace: 'nowrap', cursor: 'pointer', transition: 'var(--transition-base)',
                background: isActive ? style.bg : 'transparent',
                color: isActive ? style.color : 'var(--text-muted)',
                border: `1px solid ${isActive ? style.border : 'var(--border-dim)'}`,
                boxShadow: isActive ? `0 0 12px ${style.bg}` : 'none',
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '20px' }}>
          {[1,2,3,4,5].map(i => <div key={i} className="skeleton" style={{ height: 220, borderRadius: 'var(--radius-lg)' }} />)}
        </div>
      ) : filteredEntries.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '16px' }}>
          {filteredEntries.map((item) => (
            <Link key={item._id} to={'/manhwa/r/' + item.title.apiId} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ transition: 'transform 0.2s' }} className="hover-lift">
                <div style={{ 
                  aspectRatio: '2/3', borderRadius: 'var(--radius-md)', overflow: 'hidden', 
                  marginBottom: 8, position: 'relative', border: '1px solid var(--border-dim)' 
                }}>
                  <img src={item.title.coverImage} alt={item.title.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ 
                    position: 'absolute', bottom: 4, right: 4, background: 'rgba(0,0,0,0.7)', 
                    padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 700, backdropFilter: 'blur(4px)' 
                  }}>
                    Ch. {item.progress}
                  </div>
                </div>
                <h3 style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.title.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-dim)', borderRadius: 'var(--radius-xl)', padding: '60px 32px', textAlign: 'center' }}>
          <BarChart2 size={44} style={{ opacity: 0.15, display: 'block', margin: '0 auto 16px', color: 'var(--blue-neon)' }} />
          <p style={{ fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>Your {activeTab} list is empty</p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>Start tracking your manhwa progress today.</p>
          <Link to="/discover"><button className="btn-primary" style={{ fontSize: 13 }}>Discover Titles</button></Link>
        </div>
      )}
    </div>
  );
}
