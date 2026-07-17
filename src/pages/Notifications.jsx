// create an notification page for showing frineds notifiaction, recienved request , pending req, sent req, and other varias notifications
import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { getPendingRequests, getFriendsList } from '../api/apiClient';
import { UserPlus, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAvatarUrl } from '../utils/avatarUtils';
import { sendFriendRequest, acceptFriendRequest, declineFriendRequest } from '../api/apiClient';
import { toast } from '../components/ToastProvider';

export default function Notifications() {
    const user = useStore(state => state.user);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        getPendingRequests()
            .then(res => setPendingRequests(res.data))
            .catch(err => console.error('[PENDING REQS]', err));
        getFriendsList()
            .then(res => setFriends(res.data))
            .catch(err => console.error('[FRIENDS]', err));
    }, []);

    // if request is accepted or declined then remove the request from pending list and show toast message of accepted or declined request and also update the friends list if accepted
    const updatePendingRequests = (userId) => {
        setPendingRequests(prev => prev.filter(req => req.sender._id !== userId));
    };

    const handleAcceptRequest = (requestId) => {
        acceptFriendRequest(requestId)
            .then(() => {
                updatePendingRequests(requestId);
                toast.success('Friend request accepted');
            })
            .catch(err => console.error('[ACCEPT REQUEST]', err));
    };

    const handleDeclineRequest = (requestId) => {
        declineFriendRequest(requestId)
            .then(() => {
                updatePendingRequests(requestId);
                toast.success('Friend request declined');
            })
            .catch(err => console.error('[DECLINE REQUEST]', err));
    };


    const formatTimeAgo = (timestamp) => {
        const now = Date.now();
        const diff = now - new Date(timestamp).getTime();

        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            return `${days} day${days > 1 ? 's' : ''} ago`;
        }
        if (hours > 0) {
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        }
        if (minutes > 0) {
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        }
        return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h1 className="section-heading" style={{ marginBottom: '24px' }}>
                <UserPlus size={22} color="var(--gold-warm)" /> Notifications
            </h1>
            <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-dim)', borderRadius: 'var(--radius-xl)' }}>
                <h2 style={{ padding: '16px', borderBottom: '1px solid var(--border-dim)', fontSize: '18px' }}>Friend Requests</h2>
                {pendingRequests.length === 0 ? (
                    <p style={{ padding: '16px', color: 'var(--text-muted)' }}>No pending friend requests.</p>
                ) : (
                    pendingRequests.map((req) => (
                        //  create a card for each pending request with accept and decline button with nice design and show username and avatar of sender with text of accept and decline with nice button of logo  button and on click of accept and decline button it calls the respective function to accept and decline the request and remove the card from the list also the buttons should have hover effect and also show the toast message on accept and decline of request and also the card should have a nice design with avatar and username of sender and also show the time of request in a nice format like 2 hours ago, 1 day ago etc 
                        <div key={req._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid var(--border-dim)' }}>
                            <Link to={`/profile/${req.sender.username}`} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <img src={getAvatarUrl(req.sender.avatar)} alt="avatar" style={{ width: 40, height: 40, borderRadius: '50%' }} />
                                <span>{req.sender.username}</span>
                                <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{formatTimeAgo(req.timestamp)}</span>

                            </Link>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button onClick={() => handleAcceptRequest(req._id)} style={{ background: 'var(--green-subtle)', color: 'var(--green-neon)', border: '1px solid var(--border-green)', padding: '8px', borderRadius: 'var(--radius-md)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'var(--transition-base)' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--green-bright)'} onMouseLeave={e => e.currentTarget.style.background = 'var(--green-subtle)'}><Check size={18} /></button>
                                <button onClick={() => handleDeclineRequest(req._id)} style={{ background: 'var(--crimson-subtle)', color: 'var(--crimson-warm)', border: '1px solid var(--border-crimson)', padding: '8px', borderRadius: 'var(--radius-md)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'var(--transition-base)' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--crimson-warm)'} onMouseLeave={e => e.currentTarget.style.background = 'var(--crimson-subtle)'}><X size={18} /></button>
                            </div>
                        </div>

                    ))
                )}
            </div>
        </div>
    );
}