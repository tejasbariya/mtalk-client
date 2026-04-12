import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(err) {
    return { hasError: true, message: err?.message || 'Something went wrong.' };
  }

  componentDidCatch(err, info) {
    console.error('[ErrorBoundary]', err, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--bg-base)', flexDirection: 'column', gap: 16, padding: 24, textAlign: 'center',
        }}>
          <div style={{ fontSize: 48 }}>⚠️</div>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.5rem', color: 'var(--text-primary)' }}>
            Something went wrong
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, maxWidth: 400, lineHeight: 1.6 }}>
            {this.state.message}
          </p>
          <button
            onClick={() => window.location.href = '/'}
            style={{ marginTop: 8, padding: '10px 24px', background: 'var(--blue-bright)', color: '#fff', border: 'none', borderRadius: 'var(--radius-full)', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}
          >
            Go Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
