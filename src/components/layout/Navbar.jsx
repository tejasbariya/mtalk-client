import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, X, ChevronDown } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { searchManhwa } from '../../api/anilist';

export default function Navbar() {
  const user = useStore(state => state.user);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) { setResults([]); setOpen(false); return; }
    const t = setTimeout(async () => {
      setLoading(true);
      const data = await searchManhwa(query).catch(() => []);
      setResults(data.slice(0, 6));
      setOpen(true);
      setLoading(false);
    }, 400);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    const handler = (e) => { if (!searchRef.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <nav style={{
      height: 'var(--navbar-height)',
      background: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-dim)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 clamp(12px, 2vw, 24px)',
      gap: '12px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(20px)',
      flexShrink: 0,
    }}>

      {/* Logo — mobile only */}
      <Link to="/" style={{
        fontFamily: 'Space Grotesk, sans-serif',
        fontSize: '20px',
        fontWeight: 800,
        textDecoration: 'none',
        flexShrink: 0,
        display: 'none',
        background: 'var(--gradient-blue-gold)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }} className="mobile-logo">
        MTalk
      </Link>

      {/* Search */}
      <div ref={searchRef} style={{ flex: 1, maxWidth: '560px', margin: '0 auto', position: 'relative' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          <input
            className="input-base"
            style={{ paddingLeft: '42px', borderRadius: 'var(--radius-full)', height: '40px', fontSize: '14px' }}
            placeholder="Search titles, genres, users…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {query && (
            <button onClick={() => { setQuery(''); setOpen(false); }} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <X size={14} />
            </button>
          )}
        </div>

        {/* Dropdown */}
        {open && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0,
            background: 'var(--bg-elevated)', border: '1px solid var(--border-muted)',
            borderRadius: 'var(--radius-lg)', overflow: 'hidden',
            boxShadow: 'var(--shadow-lg)', zIndex: 999
          }}>
            {loading && <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>Searching…</div>}
            {results.map(r => (
              <Link key={r.id} to={`/manhwa/r/${r.id}`} onClick={() => { setOpen(false); setQuery(''); }}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', textDecoration: 'none', transition: 'var(--transition-base)', color: 'var(--text-primary)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <img src={r.coverImage?.large} alt="" style={{ width: 36, height: 50, borderRadius: 6, objectFit: 'cover', flexShrink: 0, border: '1px solid var(--border-dim)' }} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, lineHeight: 1.3 }}>{r.title?.english || r.title?.romaji}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{r.status?.replace('_',' ')}</div>
                </div>
              </Link>
            ))}
            {!loading && results.length === 0 && <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>No results found</div>}
          </div>
        )}
      </div>

      {/* Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <button style={{
          position: 'relative', width: 38, height: 38, borderRadius: 'var(--radius-md)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--glass-bg)', border: '1px solid var(--border-dim)',
          cursor: 'pointer', color: 'var(--text-secondary)', transition: 'var(--transition-base)'
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--blue-subtle)'; e.currentTarget.style.borderColor = 'var(--border-blue)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--glass-bg)'; e.currentTarget.style.borderColor = 'var(--border-dim)'; }}
        >
          <Bell size={17} />
          <span style={{
            position: 'absolute', top: '7px', right: '7px',
            width: 8, height: 8, borderRadius: '50%',
            background: 'var(--crimson-warm)', border: '2px solid var(--bg-surface)',
            boxShadow: '0 0 6px var(--crimson-glow)'
          }} />
        </button>

        {user ? (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 10px 4px 4px',
            background: 'var(--glass-bg)', border: '1px solid var(--border-dim)',
            borderRadius: 'var(--radius-full)', cursor: 'pointer', transition: 'var(--transition-base)'
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-blue)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-dim)'}
          >
            <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
              style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--border-blue)' }} alt="avatar" />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
              <span style={{ fontSize: '13px', fontWeight: 600 }}>{user.username}</span>
              <span className="karma-high" style={{ fontSize: '11px' }}>{user.karma} K</span>
            </div>
            <ChevronDown size={13} style={{ color: 'var(--text-muted)' }} />
          </div>
        ) : (
          <Link to="/login">
            <button className="btn-primary" style={{ height: 38, padding: '0 18px', fontSize: '13px' }}>Sign In</button>
          </Link>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) { .mobile-logo { display: block !important; } }
      `}</style>
    </nav>
  );
}
