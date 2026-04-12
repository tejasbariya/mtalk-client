import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Library, MessageSquare, Users, Settings, Zap } from 'lucide-react';

const links = [
  { icon: Home,          label: 'Home',        path: '/',          accent: '--blue-bright' },
  { icon: Compass,       label: 'Discover',    path: '/discover',  accent: '--blue-bright' },
  { icon: Library,       label: 'Library',     path: '/library',   accent: '--green-bright' },
  { icon: MessageSquare, label: 'Global Chat', path: '/chat',      accent: '--blue-bright' },
  { icon: Users,         label: 'Community',   path: '/community', accent: '--gold-bright' },
  { icon: Settings,      label: 'Settings',    path: '/settings',  accent: '--gray-400' },
];

export default function Sidebar() {
  const { pathname } = useLocation();

  return (
    <>
      <aside id="desktop-sidebar" style={{
        width: 'var(--sidebar-width)',
        flexShrink: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--gradient-sidebar)',
        borderRight: '1px solid var(--border-dim)',
        overflow: 'hidden',
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--border-dim)', flexShrink: 0 }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'block' }}>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '22px', fontWeight: 800, lineHeight: 1 }}>
              <span style={{ background: 'var(--gradient-blue-gold)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>MT</span>
              <span style={{ color: 'var(--text-primary)' }}>alk</span>
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '3px' }}>
              Manhwa Social Hub
            </div>
          </Link>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 10px', scrollbarWidth: 'none' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-dim)', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '4px 12px 8px' }}>
            Main Menu
          </div>
          {links.map(({ icon: Icon, label, path, accent }) => {
            const active = pathname === path;
            return (
              <Link key={path} to={path} style={{ textDecoration: 'none', display: 'block', marginBottom: '2px' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '10px 14px', borderRadius: 'var(--radius-md)',
                  background: active ? 'var(--blue-subtle)' : 'transparent',
                  border: active ? '1px solid var(--border-blue)' : '1px solid transparent',
                  color: active ? 'var(--blue-neon)' : 'var(--text-secondary)',
                  fontWeight: active ? 600 : 400,
                  fontSize: '14px',
                  transition: 'var(--transition-base)',
                  position: 'relative',
                }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--glass-bg)'; e.currentTarget.style.color = 'var(--text-primary)'; }}}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}}
                >
                  {active && (
                    <span style={{
                      position: 'absolute', left: 0, top: '20%', bottom: '20%',
                      width: '3px', borderRadius: '0 4px 4px 0',
                      background: `var(${accent})`,
                    }} />
                  )}
                  <Icon size={17} strokeWidth={active ? 2.5 : 1.8} />
                  <span>{label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Pro Banner */}
        <div style={{ padding: '12px 12px 16px', flexShrink: 0 }}>
          <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(245,158,11,0.08) 100%)', border: '1px solid var(--border-gold)', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
              <Zap size={14} style={{ color: 'var(--gold-warm)' }} />
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--gold-warm)' }}>MTalk Pro</span>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>Ad-free tracking, exclusive themes &amp; early features.</p>
          </div>
        </div>
      </aside>

      {/* Hide sidebar on mobile */}
      <style>{`
        @media (max-width: 768px) {
          #desktop-sidebar { display: none !important; }
        }
      `}</style>
    </>
  );
}
