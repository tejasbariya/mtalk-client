import { useQuery } from '@tanstack/react-query';
import { fetchTrendingManhwa, fetchPopularManhwa } from '../api/anilist';
import { motion } from 'framer-motion';
import { Star, TrendingUp, Flame, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const statusColor = {
  RELEASING: 'badge-green',
  FINISHED: 'badge-gray',
  NOT_YET_RELEASED: 'badge-blue',
  CANCELLED: 'badge-crimson',
  HIATUS: 'badge-gold',
};

function SkeletonCard({ h = 360 }) {
  return <div className="skeleton" style={{ height: h, borderRadius: 'var(--radius-md)' }} />;
}

export default function Home() {
  const { data: trending, isLoading: tLoading } = useQuery({
    queryKey: ['trending'], queryFn: fetchTrendingManhwa, staleTime: 5 * 60 * 1000,
  });
  const { data: popular, isLoading: pLoading } = useQuery({
    queryKey: ['popular'], queryFn: fetchPopularManhwa, staleTime: 5 * 60 * 1000,
  });

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'clamp(32px, 5vw, 56px)' }}>

      {/* ── Trending Hero Carousel ─────────────────────── */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <Flame size={22} color="var(--crimson-warm)" />
          <h2 className="section-heading">Trending Now</h2>
          <div className="divider" />
          <Link to="/discover" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 600, color: 'var(--blue-neon)', textDecoration: 'none', flexShrink: 0 }}>
            View all <ChevronRight size={14} />
          </Link>
        </div>

        <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '16px' }} className="hide-scrollbar">
          {tLoading
            ? [1,2,3,4,5].map(i => (
                <div key={i} style={{ minWidth: 'clamp(220px, 28vw, 300px)', flexShrink: 0 }}>
                  <SkeletonCard h={380} />
                </div>
              ))
            : trending?.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  style={{ minWidth: 'clamp(220px, 28vw, 300px)', flexShrink: 0 }}
                >
                  <Link to={`/manhwa/r/${item.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                    <div className="cover-card" style={{ paddingBottom: '140%', position: 'relative' }}>
                      <img src={item.coverImage.extraLarge || item.coverImage.large} alt={item.title.english}
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div className="cover-card-overlay" />

                      {/* Rank badge */}
                      <span style={{
                        position: 'absolute', top: '12px', left: '12px',
                        width: '32px', height: '32px', borderRadius: 'var(--radius-sm)',
                        background: 'var(--gold-subtle)', border: '1px solid var(--border-gold)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '13px', fontWeight: 800, color: 'var(--gold-warm)',
                        boxShadow: 'var(--shadow-gold)',
                      }}>#{idx + 1}</span>

                      {/* Score */}
                      <span className="badge badge-gold" style={{
                        position: 'absolute', top: '12px', right: '12px',
                        boxShadow: '0 0 10px var(--gold-glow)',
                      }}>
                        <Star size={10} fill="currentColor" /> {(item.averageScore / 10).toFixed(1)}
                      </span>

                      {/* Bottom info */}
                      <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 14px',
                        background: 'linear-gradient(to top, rgba(8,8,14,1) 0%, rgba(8,8,14,0.6) 60%, transparent 100%)',
                      }}>
                        <h3 style={{ fontSize: '14px', fontWeight: 700, lineHeight: 1.3, marginBottom: '8px',
                          overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                          {item.title.english || item.title.romaji}
                        </h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {item.genres.slice(0, 2).map(g => (
                            <span key={g} className="badge badge-blue" style={{ fontSize: '10px', padding: '2px 7px' }}>{g}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
          }
        </div>
      </section>

      {/* ── Popular Grid ─────────────────────────────── */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <TrendingUp size={22} color="var(--blue-bright)" />
          <h2 className="section-heading">Popular This Week</h2>
          <div className="divider" />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
          gap: 'clamp(10px, 2vw, 20px)',
        }}>
          {pLoading
            ? [1,2,3,4,5,6,7,8,9,10].map(i => (
                <div key={i}><SkeletonCard h={200} /><div className="skeleton" style={{ height: 14, marginTop: 10, borderRadius: 4, width: '80%' }} /></div>
              ))
            : popular?.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.04 }}
                >
                  <Link to={`/manhwa/r/${item.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                    <div className="cover-card" style={{ paddingBottom: '145%', position: 'relative', marginBottom: '10px' }}>
                      <img src={item.coverImage.large} alt={item.title.english}
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div className="cover-card-overlay" />
                      <span className={`badge ${statusColor[item.status] || 'badge-gray'}`}
                        style={{ position: 'absolute', top: '8px', left: '8px', fontSize: '9px', padding: '2px 6px' }}>
                        {item.status?.replace('_', ' ')}
                      </span>
                    </div>
                    <h3 style={{
                      fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      transition: 'var(--transition-base)',
                    }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--blue-neon)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                    >
                      {item.title.english || item.title.romaji}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                      <Star size={11} fill="var(--gold-warm)" color="var(--gold-warm)" />
                      <span style={{ fontSize: '11px', color: 'var(--gold-warm)', fontWeight: 600 }}>
                        {(item.averageScore / 10).toFixed(1)}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))
          }
        </div>
      </section>
    </div>
  );
}
