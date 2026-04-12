import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Library, MessageSquare, Users } from 'lucide-react';

const links = [
  { icon: Home,          label: 'Home',     path: '/' },
  { icon: Compass,       label: 'Discover', path: '/discover' },
  { icon: Library,       label: 'Library',  path: '/library' },
  { icon: MessageSquare, label: 'Chat',     path: '/chat' },
  { icon: Users,         label: 'Community',path: '/community' },
];

export default function MobileNav() {
  const { pathname } = useLocation();

  return (
    <>
      {/* This nav is rendered in the DOM always, but only DISPLAYED on mobile via CSS */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60px',
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-dim)',
        display: 'flex',          /* shown by default */
        alignItems: 'stretch',
        zIndex: 300,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }} id="mobile-bottom-nav">
        {links.map(({ icon: Icon, label, path }) => {
          const active = pathname === path;
          return (
            <Link key={path} to={path} style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              textDecoration: 'none',
              fontSize: '10px',
              fontWeight: 600,
              color: active ? 'var(--blue-neon)' : 'var(--text-muted)',
              background: active ? 'var(--blue-subtle)' : 'transparent',
              letterSpacing: '0.03em',
              transition: 'var(--transition-base)',
              borderTop: active ? '2px solid var(--blue-bright)' : '2px solid transparent',
            }}>
              <Icon size={19} strokeWidth={active ? 2.5 : 1.8} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/*
        Hide on desktop (≥769px), show on mobile (≤768px).
        Using a <style> tag here keeps it co-located with the component.
      */}
      <style>{`
        @media (min-width: 769px) {
          #mobile-bottom-nav { display: none !important; }
        }
      `}</style>
    </>
  );
}
