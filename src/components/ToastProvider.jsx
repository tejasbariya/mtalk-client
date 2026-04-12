import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, AlertTriangle, X } from 'lucide-react';

// ── Singleton event bus ────────────────────────────────────────
const listeners = new Set();

export const toast = {
  success: (msg) => emit('success', msg),
  error:   (msg) => emit('error',   msg),
  warn:    (msg) => emit('warn',    msg),
};

function emit(type, message) {
  const id = Date.now() + Math.random();
  listeners.forEach(fn => fn({ id, type, message }));
}

// ── Hook ──────────────────────────────────────────────────────
function useToasts() {
  const [items, setItems] = useState([]);

  const add = useCallback((t) => {
    setItems(prev => [...prev.slice(-4), t]); // max 5 at once
    setTimeout(() => setItems(prev => prev.filter(x => x.id !== t.id)), 4000);
  }, []);

  useEffect(() => {
    listeners.add(add);
    return () => listeners.delete(add);
  }, [add]);

  const remove = (id) => setItems(prev => prev.filter(x => x.id !== id));
  return { items, remove };
}

// ── Color map ──────────────────────────────────────────────────
const styles = {
  success: { bg: 'var(--green-subtle)',   border: 'var(--border-green)',   color: 'var(--green-neon)',   Icon: CheckCircle },
  error:   { bg: 'var(--crimson-subtle)', border: 'var(--border-crimson)', color: 'var(--crimson-warm)', Icon: XCircle },
  warn:    { bg: 'var(--gold-subtle)',    border: 'var(--border-gold)',     color: 'var(--gold-warm)',    Icon: AlertTriangle },
};

// ── Component ─────────────────────────────────────────────────
export default function ToastProvider() {
  const { items, remove } = useToasts();

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      display: 'flex', flexDirection: 'column', gap: 10,
      pointerEvents: 'none',
    }}>
      {items.map(({ id, type, message }) => {
        const { bg, border, color, Icon } = styles[type] || styles.error;
        return (
          <div key={id} style={{
            display: 'flex', alignItems: 'flex-start', gap: 10,
            background: bg, border: `1px solid ${border}`,
            borderRadius: 'var(--radius-md)', padding: '12px 16px',
            maxWidth: 360, boxShadow: 'var(--shadow-lg)',
            backdropFilter: 'blur(20px)',
            pointerEvents: 'all',
            animation: 'toastIn 0.25s ease',
          }}>
            <Icon size={17} color={color} style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.5, flex: 1, margin: 0 }}>{message}</p>
            <button onClick={() => remove(id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0, flexShrink: 0 }}>
              <X size={14} />
            </button>
          </div>
        );
      })}
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
