import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchTitleDetails } from '../api/anilist';
import { Star, Library, MessageSquare, Info, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';

const statusMap = {
  RELEASING: { label: 'Ongoing', cls: 'badge-green' },
  FINISHED: { label: 'Completed', cls: 'badge-gray' },
  HIATUS: { label: 'Hiatus', cls: 'badge-gold' },
  CANCELLED: { label: 'Cancelled', cls: 'badge-crimson' },
};

export default function TitleDetails() {
  // slug is the AniList numeric ID (e.g. /manhwa/r/123456)
  const { slug } = useParams();
  const id = slug;

  const { data: title, isLoading } = useQuery({
    queryKey: ['title', id],
    queryFn: () => fetchTitleDetails(Number(id)),
  });

  if (isLoading) return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div className="skeleton" style={{ height: 380, borderRadius: 'var(--radius-lg)', marginBottom: 24 }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24 }}>
        <div><div className="skeleton" style={{ height: 200, borderRadius: 'var(--radius-lg)' }} /></div>
        <div><div className="skeleton" style={{ height: 200, borderRadius: 'var(--radius-lg)' }} /></div>
      </div>
    </div>
  );

  if (!title) return <div style={{ textAlign: 'center', paddingTop: 60, color: 'var(--text-muted)' }}>Title not found.</div>;

  const status = statusMap[title.status] || { label: title.status, cls: 'badge-gray' };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2.5vw, 28px)' }}>

      {/* ── Hero Banner ── */}
      <div style={{ position: 'relative', borderRadius: 'var(--radius-xl)', overflow: 'hidden', minHeight: 'clamp(240px, 40vw, 400px)', background: 'var(--bg-card)' }}>
        {title.bannerImage && (
          <img src={title.bannerImage} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4, filter: 'blur(2px)' }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg-base) 10%, rgba(8,8,14,0.5) 60%, transparent 100%)' }} />

        {/* Content overlay */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: 'clamp(16px, 3vw, 32px)',
          display: 'flex', alignItems: 'flex-end', gap: 'clamp(14px, 3vw, 28px)',
        }}>
          {/* Cover */}
          <img src={title.coverImage.extraLarge} alt={title.title.english}
            style={{
              width: 'clamp(90px, 12vw, 160px)', flexShrink: 0,
              borderRadius: 'var(--radius-md)', border: '2px solid var(--border-blue)',
              boxShadow: 'var(--shadow-blue)', objectFit: 'cover',
              aspectRatio: '2/3',
            }} />

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px', alignItems: 'center' }}>
              <span className={`badge ${status.cls}`}>{status.label}</span>
              <span className="badge badge-gold">
                <Star size={10} fill="currentColor" /> {(title.averageScore / 10).toFixed(1)}
              </span>
              {title.chapters && <span className="badge badge-blue"><BookOpen size={10} /> {title.chapters} ch</span>}
            </div>

            <h1 style={{
              fontSize: 'clamp(18px, 3.5vw, 36px)', fontWeight: 800, lineHeight: 1.2,
              marginBottom: '12px', fontFamily: 'Space Grotesk, sans-serif',
              background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--blue-neon) 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              {title.title.english || title.title.romaji}
            </h1>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <button className="btn-primary" style={{ fontSize: '13px', padding: '8px 18px' }}>
                <Library size={15} /> Add to Library
              </button>
              <button className="btn-ghost" style={{ fontSize: '13px', padding: '8px 18px' }}>
                <MessageSquare size={15} /> Title Chat
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) clamp(220px, 25%, 280px)', gap: 'clamp(16px, 2.5vw, 28px)' }} className="title-grid">
        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Synopsis */}
          <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-dim)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Info size={16} color="var(--blue-bright)" /> Synopsis
            </h3>
            <p style={{ fontSize: '14px', lineHeight: 1.8, color: 'var(--text-secondary)' }}
              dangerouslySetInnerHTML={{ __html: title.description?.replace(/<br>/gi, ' ') }} />

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
              {title.genres.map(g => (
                <span key={g} className="badge badge-blue">{g}</span>
              ))}
            </div>
          </div>

          {/* Reviews Placeholder */}
          <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-dim)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Star size={16} color="var(--gold-warm)" /> Community Reviews
              </h3>
              <button className="btn-ghost" style={{ fontSize: '12px', padding: '6px 14px' }}>Write a Review</button>
            </div>
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)', fontSize: '14px' }}>
              <AlertCircle size={36} style={{ marginBottom: 12, opacity: 0.3, margin: '0 auto 12px' }} />
              <p>No reviews yet. Be the first!</p>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--bg-elevated)', borderTop: '3px solid var(--gold-bright)', border: '1px solid var(--border-gold)', borderRadius: 'var(--radius-lg)', padding: '20px', boxShadow: '0 0 20px rgba(245,158,11,0.08)' }}>
            <h4 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px' }}>Information</h4>
            {[
              ['Chapters', title.chapters || '?'],
              ['Volumes', title.volumes || '?'],
              ['Status', title.status?.toLowerCase().replace('_', ' ')],
              ['Score', `${(title.averageScore / 10).toFixed(1)} / 10`],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border-dim)', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-muted)' }}>{k}</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)', textTransform: 'capitalize' }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Status card */}
          <div style={{
            background: title.status === 'RELEASING' ? 'var(--green-subtle)' : title.status === 'HIATUS' ? 'var(--gold-subtle)' : 'var(--glass-bg)',
            border: `1px solid ${title.status === 'RELEASING' ? 'var(--border-green)' : title.status === 'HIATUS' ? 'var(--border-gold)' : 'var(--border-dim)'}`,
            borderRadius: 'var(--radius-lg)', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px'
          }}>
            {title.status === 'RELEASING'
              ? <CheckCircle size={22} color="var(--green-bright)" />
              : title.status === 'HIATUS'
                ? <AlertCircle size={22} color="var(--gold-warm)" />
                : <Info size={22} color="var(--gray-400)" />
            }
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: title.status === 'RELEASING' ? 'var(--green-neon)' : 'var(--text-primary)' }}>
                {title.status === 'RELEASING' ? 'Actively Updating' : title.status === 'HIATUS' ? 'On Hiatus' : 'Finished'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: 2 }}>Community updates via MTalk</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 720px) {
          .title-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
