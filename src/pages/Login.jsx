import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import { loginUser } from '../api/apiClient';
import { useStore } from '../store/useStore';

export default function Login() {
  const setAuth = useStore(s => s.setAuth);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginUser({ email: form.email, password: form.password });
      setAuth(res.data.user, res.data.token);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)', padding: '20px' }}>
      {/* Background glow blobs */}
      <div style={{ position: 'fixed', top: '20%', right: '15%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '15%', left: '10%', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2rem', fontWeight: 800, display: 'inline-block' }}>
              <span style={{ background: 'var(--gradient-blue-gold)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>MT</span>
              <span style={{ color: 'var(--text-primary)' }}>alk</span>
            </div>
          </Link>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 6 }}>Welcome back, manhwa fan</p>
        </div>

        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-muted)', borderRadius: 'var(--radius-xl)', padding: 'clamp(24px, 5vw, 36px)', boxShadow: 'var(--shadow-lg)' }}>
          <h1 style={{ fontSize: '1.4rem', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, marginBottom: 24 }}>Sign In</h1>

          {error && (
            <div style={{ marginBottom: 16, padding: '12px 16px', background: 'var(--crimson-subtle)', border: '1px solid var(--border-crimson)', borderRadius: 'var(--radius-md)', fontSize: 13, color: 'var(--crimson-warm)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={labelStyle}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={iconStyle} />
                <input name="email" type="email" required autoComplete="email" className="input-base" style={inputStyle} placeholder="you@example.com" value={form.email} onChange={handleChange} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
                <Link to="/forgot-password" style={{ fontSize: 12, color: 'var(--blue-neon)', textDecoration: 'none' }}>Forgot password?</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={iconStyle} />
                <input name="password" type={showPw ? 'text' : 'password'} required autoComplete="current-password" className="input-base" style={{ ...inputStyle, paddingRight: 44 }} placeholder="Your password" value={form.password} onChange={handleChange} />
                <button type="button" onClick={() => setShowPw(p => !p)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ height: 48, justifyContent: 'center', marginTop: 4, fontSize: 15, opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Signing in…' : <><LogIn size={16} /> Sign In</>}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--blue-neon)', fontWeight: 600, textDecoration: 'none' }}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' };
const iconStyle  = { position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' };
const inputStyle = { paddingLeft: 40, height: 46 };
