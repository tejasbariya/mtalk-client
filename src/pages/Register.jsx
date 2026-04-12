import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock, Zap } from 'lucide-react';
import { registerUser } from '../api/apiClient';
import { useStore } from '../store/useStore';

export default function Register() {
  const setAuth = useStore(s => s.setAuth);
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      const res = await registerUser({ username: form.username, email: form.email, password: form.password });
      setAuth(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)', padding: '20px' }}>
      {/* Background glow blobs */}
      <div style={{ position: 'fixed', top: '10%', left: '15%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '10%', right: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2rem', fontWeight: 800, display: 'inline-block' }}>
              <span style={{ background: 'var(--gradient-blue-gold)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>MT</span>
              <span style={{ color: 'var(--text-primary)' }}>alk</span>
            </div>
          </Link>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 6 }}>Join the ultimate manhwa community</p>
        </div>

        {/* Card */}
        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-muted)', borderRadius: 'var(--radius-xl)', padding: 'clamp(24px, 5vw, 36px)', boxShadow: 'var(--shadow-lg)' }}>
          <h1 style={{ fontSize: '1.4rem', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, marginBottom: 24 }}>Create Account</h1>

          {error && (
            <div style={{ marginBottom: 16, padding: '12px 16px', background: 'var(--crimson-subtle)', border: '1px solid var(--border-crimson)', borderRadius: 'var(--radius-md)', fontSize: 13, color: 'var(--crimson-warm)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Username */}
            <div>
              <label style={labelStyle}>Username</label>
              <div style={{ position: 'relative' }}>
                <User size={15} style={iconStyle} />
                <input name="username" required autoComplete="username" className="input-base" style={inputStyle} placeholder="shadowmonarch_" value={form.username} onChange={handleChange} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={labelStyle}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={iconStyle} />
                <input name="email" type="email" required autoComplete="email" className="input-base" style={inputStyle} placeholder="you@example.com" value={form.email} onChange={handleChange} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={iconStyle} />
                <input name="password" type={showPw ? 'text' : 'password'} required autoComplete="new-password" className="input-base" style={{ ...inputStyle, paddingRight: 44 }} placeholder="Min. 6 characters" value={form.password} onChange={handleChange} />
                <button type="button" onClick={() => setShowPw(p => !p)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Confirm */}
            <div>
              <label style={labelStyle}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={iconStyle} />
                <input name="confirm" type={showPw ? 'text' : 'password'} required className="input-base" style={inputStyle} placeholder="Repeat password" value={form.confirm} onChange={handleChange} />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ height: 48, justifyContent: 'center', marginTop: 4, fontSize: 15, opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Creating account…' : <><Zap size={16} /> Create Account</>}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--blue-neon)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 };
const iconStyle  = { position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' };
const inputStyle = { paddingLeft: 40, height: 46 };
