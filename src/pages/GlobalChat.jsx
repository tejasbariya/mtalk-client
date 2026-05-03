import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useStore } from '../store/useStore';
import { Send, Hash, Users, Circle } from 'lucide-react';
import API from '../api/apiClient';
import { getAvatarUrl } from '../utils/avatarUtils'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function GlobalChat() {
  const user = useStore(state => state.user);
  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const [input, setInput] = useState('');
  const socketRef = useRef(null);
  const endRef = useRef(null);
  
  // Fetch last 50 messages
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get('/api/chat/global');
        setMessages(res.data.messages);
      } catch (err) {
        console.error('[CHAT_HISTORY]', err);
      }
    };

    fetchHistory();
  }, [user])

  useEffect(() => {

    const token = useStore.getState().token;
    socketRef.current = io(API_URL, {
      auth: { token } 
    });
    

    // Join with user data for member tracking
    socketRef.current.emit('join_room', {
      room: 'global',
      user: user ? {
        id: user.id,
        username: user.username,
        avatar: user.avatar
      } : null
    });


    socketRef.current.on('receive_message', (msg) => setMessages(p => [...p, msg]));
    socketRef.current.on('room_members', (m) => setMembers(m));

    return () => socketRef.current?.disconnect();
  }, [user]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = (e) => {
    e.preventDefault();
    if (!input.trim() || !user) return;
    socketRef.current.emit('send_message', {
      room: 'global',
      text: input,
    });
    setInput('');
  };

  return (
    <div style={{ height: 'calc(100dvh - var(--navbar-height) - 80px)', display: 'flex', gap: '16px' }}>

      {/* Main Chat */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-dim)', overflow: 'hidden', minWidth: 0 }}>
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-dim)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, background: 'var(--bg-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--blue-subtle)', border: '1px solid var(--border-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Hash size={18} color="var(--blue-neon)" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', fontSize: '15px' }}>global-pub</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Public · All manhwa fans</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Circle size={8} fill="var(--green-bright)" color="var(--green-bright)" style={{ filter: 'drop-shadow(0 0 4px var(--green-glow))' }} />
            <span style={{ fontSize: '12px', color: 'var(--green-neon)', fontWeight: 600 }}>Live</span>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }} className="hide-scrollbar">
          {messages.length === 0 && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)', gap: '12px', textAlign: 'center', padding: '40px' }}>
              <Hash size={40} style={{ opacity: 0.2 }} />
              <p style={{ fontSize: '14px' }}>No messages yet — say hi to the community!</p>
            </div>
          )}
          {messages.map((msg, i) => {
            const isHighKarma = (msg.user?.karma || 0) > 100;
            return (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <img src={getAvatarUrl(msg.user?.avatar, msg.user?.username)}
                  style={{ width: 36, height: 36, borderRadius: '50%', border: `2px solid ${isHighKarma ? 'var(--gold-bright)' : 'var(--border-dim)'}`, objectFit: 'cover', flexShrink: 0 }} alt="" />
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: isHighKarma ? 'var(--gold-warm)' : 'var(--text-primary)' }}>
                      {msg.user?.username}
                    </span>
                    <span className="karma-badge">{msg.user?.karma} K</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div style={{
                    display: 'inline-block', background: isHighKarma ? 'rgba(245,158,11,0.07)' : 'var(--bg-hover)',
                    border: `1px solid ${isHighKarma ? 'var(--border-gold)' : 'var(--border-dim)'}`,
                    borderRadius: '0 var(--radius-md) var(--radius-md) var(--radius-md)',
                    padding: '10px 14px', fontSize: '14px', color: 'var(--text-secondary)',
                    maxWidth: '100%', lineHeight: 1.6,
                    boxShadow: isHighKarma ? '0 0 12px rgba(245,158,11,0.1)' : 'none',
                  }}>
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border-dim)', background: 'var(--bg-card)', flexShrink: 0 }}>
          <form onSubmit={send} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              className="input-base"
              style={{ flex: 1, height: '44px', borderRadius: 'var(--radius-full)', padding: '0 20px', background: 'var(--bg-input)' }}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={user ? 'Message #global-pub...' : 'Log in to chat...'}
              disabled={!user}
            />
            <button type="submit" disabled={!user || !input.trim()}
              style={{ width: 44, height: 44, borderRadius: 'var(--radius-full)', background: 'var(--blue-bright)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-blue)', transition: 'var(--transition-base)', flexShrink: 0, opacity: (!user || !input.trim()) ? 0.5 : 1 }}
              onMouseEnter={e => { if (user && input.trim()) e.currentTarget.style.background = 'var(--blue-neon)'; }}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--blue-bright)'}
            >
              <Send size={17} color="#fff" />
            </button>
          </form>
        </div>
      </div>

      {/* Online Sidebar — hidden on mobile */}
      <div style={{ width: '220px', flexShrink: 0, display: 'flex', flexDirection: 'column', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-dim)', overflow: 'hidden' }} className="chat-sidebar">
        <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid var(--border-dim)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={15} color="var(--blue-neon)" />
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Online · {members.length}</span>
        </div>
        <div style={{ overflow: 'auto', padding: '10px 8px' }} className="hide-scrollbar">
          {members.map((m, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'var(--transition-base)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ position: 'relative' }}>
                <img src={getAvatarUrl(m.avatar, m.username)} style={{ width: 32, height: 32, borderRadius: '50%', border: '1.5px solid var(--border-dim)' }} alt="" />
                <span style={{ position: 'absolute', bottom: 0, right: 0, width: 9, height: 9, borderRadius: '50%', background: 'var(--green-bright)', border: '2px solid var(--bg-elevated)', boxShadow: '0 0 5px var(--green-glow)' }} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>{m.username}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .chat-sidebar { display: none !important; } }
      `}</style>
    </div>
  );
}
