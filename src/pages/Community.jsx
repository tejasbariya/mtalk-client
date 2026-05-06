import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Activity, UserPlus, Search, Users, Check } from 'lucide-react';
import { searchUsers, sendFriendRequest, getFriendsList } from '../api/apiClient';
import { getAvatarUrl } from '../utils/avatarUtils';
import { Link } from 'react-router-dom';
import { toast } from '../components/ToastProvider';


export default function Community() {
  const user = useStore(state => state.user);
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    // Fetch friends list on component mount
    getFriendsList()
      .then(res => setFriends(res.data))
      .catch(err => console.error('[FRIENDS]', err));
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      searchUsers(search)
        .then(res => setResults(res.data))
        .catch(err => console.error('[SEARCH]', err));
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const handleAddFriend = (userId) => {
    sendFriendRequest(userId)
      .then(() => {
        setResults(prev => prev.map(u => u._id === userId ? { ...u, relation: 'REQUEST_SENT' } : u));
        toast.success('Friend request sent');
      })
      .catch((err) => {
        console.error('[ADD FRIEND]', err);
        toast.error(err.response?.data?.message || 'Failed to send request');
      });
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 280px', gap: 24 }} className="community-grid">
      {/* Activity Feed */}
      <div>
        <h1 className="section-heading" style={{ marginBottom: '24px' }}>
          <Activity size={22} color="var(--gold-warm)" /> Friend Activity
        </h1>
        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-dim)', borderRadius: 'var(--radius-xl)', padding: '48px 32px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <Users size={48} style={{ opacity: 0.15, display: 'block', margin: '0 auto 16px' }} />
          </div>
          <p style={{ fontWeight: 600, marginBottom: 8 }}>No activity yet</p>
          <p style={{ fontSize: '13px' }}>Add friends to watch their library updates, reviews, and posts here.</p>
        </div>
      </div>

      {/* Friends Panel */}
      <div>
        <h2 className="section-heading" style={{ marginBottom: '24px', fontSize: '18px' }}>
          <UserPlus size={18} color="var(--blue-bright)" /> Friends
        </h2>
        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-dim)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-dim)', position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 28, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              className="input-base"
              style={{ paddingLeft: 36, height: 38, fontSize: 13, borderRadius: 'var(--radius-md)' }}
              placeholder="Search users…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>


          {search ? (
            <div style={{ maxHeight: '300px', overflowY: 'auto' }} className="hide-scrollbar">
              {results.length > 0 ? (
                results.map((u, idx) => (
                  <div key={u._id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: idx === results.length - 1 ? 'none' : '1px solid var(--border-dim)', transition: 'background 0.2s' }}>
                    <Link to={`/profile/${u._id}`} style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, textDecoration: 'none', minWidth: 0 }}>
                      <img src={getAvatarUrl(u.avatar, u.username)} style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--bg-card)', border: '1px solid var(--border-muted)', objectFit: 'cover', flexShrink: 0 }} alt="" />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.username}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{u.karma || 0} Karma</div>
                      </div>
                    </Link>

                    {/* Dynamic Button driven by the Backend's relationship status */}
                    {u.relation === 'FRIEND' ? (
                      <button className="btn-ghost" disabled style={{ padding: '6px 12px', fontSize: '11px', height: '28px', display: 'flex', alignItems: 'center', gap: 4, background: 'transparent', color: 'var(--text-dim)', border: '1px solid var(--border-dim)', cursor: 'not-allowed' }}><Check size={12} /> Friend</button>
                    ) : u.relation === 'REQUEST_SENT' ? (
                      <button className="btn-ghost" disabled style={{ padding: '6px 12px', fontSize: '11px', height: '28px', display: 'flex', alignItems: 'center', gap: 4, background: 'var(--blue-subtle)', color: 'var(--blue-neon)', border: '1px solid var(--border-blue)', cursor: 'not-allowed' }}><Check size={12} /> Requested</button>
                    ) : u.relation === 'REQUEST_RECEIVED' ? (
                      <Link to="/notifications" style={{ textDecoration: 'none' }}><button className="btn-primary" style={{ padding: '6px 12px', fontSize: '11px', height: '28px', display: 'flex', alignItems: 'center', gap: 4 }}>Review</button></Link>
                    ) : (
                      <button className="btn-ghost" onClick={() => handleAddFriend(u._id)} style={{ padding: '6px 12px', fontSize: '11px', height: '28px', display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-primary)' }}><UserPlus size={12} /> Add</button>
                    )}
                  </div>
                ))
              ) : (
                <div style={{ padding: '32px 24px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '13px' }}>No users found for "{search}"</div>
              )}
            </div>
          ) : (
            <div style={{ padding: '32px 24px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '13px' }}>Search for users to add them as friends.</div>
          )}
        </div>

        {/* My Friends List */}
        <div style={{ marginTop: 32 }}>
          <h2 className="section-heading" style={{ marginBottom: '16px', fontSize: '18px' }}><Users size={18} color="var(--green-neon)" /> My Friends</h2>
          <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-dim)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
            {friends.length > 0 ? (
              <div style={{ maxHeight: '300px', overflowY: 'auto' }} className="hide-scrollbar">
                {friends.map((friend, idx) => (
                  <div key={friend._id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: idx === friends.length - 1 ? 'none' : '1px solid var(--border-dim)' }}>
                    <Link to={`/profile/${friend._id}`} style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, textDecoration: 'none', minWidth: 0 }}>
                      <img src={getAvatarUrl(friend.avatar, friend.username)} style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--bg-card)', border: '1px solid var(--border-muted)', objectFit: 'cover', flexShrink: 0 }} alt="" />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{friend.username}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{friend.karma || 0} Karma</div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '32px 24px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '13px' }}>You haven't added any friends yet.</div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 720px) { .community-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
