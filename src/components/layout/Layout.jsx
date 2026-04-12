import Sidebar from './Sidebar';
import Navbar from './Navbar';
import MobileNav from './MobileNav';

export default function Layout({ children }) {
  return (
    <div style={{
      display: 'flex',
      height: '100dvh',
      overflow: 'hidden',
      background: 'var(--bg-base)',
    }}>
      {/* ── Sidebar: visible only on desktop (≥769px) via CSS ── */}
      <Sidebar />

      {/* ── Right panel ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        {/* ── Navbar: visible on ALL screen sizes ── */}
        <Navbar />

        {/* ── Scrollable page content ── */}
        <main style={{
          flex: 1,
          overflowY: 'auto',
          padding: 'clamp(16px, 2.5vw, 32px)',
          /* Add bottom padding on mobile to clear the bottom tab bar */
          paddingBottom: 'clamp(76px, 10vw, 36px)',
        }}>
          {children}
        </main>
      </div>

      {/* ── Mobile bottom tab bar: visible only on mobile (≤768px) via CSS ── */}
      <MobileNav />
    </div>
  );
}
