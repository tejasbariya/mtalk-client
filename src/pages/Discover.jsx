import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchManhwa } from '../api/anilist';
import { Search, SlidersHorizontal, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Discover() {
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 450);
    return () => clearTimeout(t);
  }, [query]);

  const { data, isLoading } = useQuery({
    queryKey: ['search', debounced],
    queryFn: () => searchManhwa(debounced),
    enabled: debounced.length > 1,
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h1 className="section-heading" style={{ marginBottom: '24px' }}>
        <Search size={22} color="var(--blue-bright)" /> Discover
      </h1>

      {/* Search Bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          <input
            autoFocus
            className="input-base"
            style={{ paddingLeft: '46px', height: '52px', borderRadius: 'var(--radius-full)', fontSize: '16px' }}
            placeholder="Search manhwa & manhua titles…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <button className="btn-ghost" style={{ height: 52, padding: '0 20px', borderRadius: 'var(--radius-full)' }}>
          <SlidersHorizontal size={17} /> Filters
        </button>
      </div>

      {/* Empty state */}
      {!debounced && (
        <div style={{ textAlign: 'center', paddingTop: 60, color: 'var(--text-dim)' }}>
          <Search size={52} style={{ opacity: 0.15, display: 'block', margin: '0 auto 16px' }} />
          <p style={{ fontSize: '15px' }}>Start typing to discover new series</p>
          <p style={{ fontSize: '13px', marginTop: 8, color: 'var(--text-dim)' }}>Search across thousands of manhwa and manhua titles</p>
        </div>
      )}

      {/* Skeletons */}
      {isLoading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 16 }}>
          {Array(12).fill(0).map((_, i) => (
            <div key={i}>
              <div className="skeleton" style={{ paddingBottom: '145%', borderRadius: 'var(--radius-md)', marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 12, width: '75%', borderRadius: 4 }} />
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {data && data.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 'clamp(10px, 2vw, 18px)' }}>
          {data.map(item => (
            <Link key={item.id} to={`/manhwa/r/${item.id}`} style={{ textDecoration: 'none', display: 'block' }}>
              <div className="cover-card" style={{ paddingBottom: '145%', position: 'relative', marginBottom: 10 }}>
                <img src={item.coverImage?.large} alt={item.title?.english}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                <div className="cover-card-overlay" />
                <span className="badge badge-gold" style={{ position: 'absolute', top: 8, right: 8, fontSize: 9, padding: '2px 6px' }}>
                  <Star size={9} fill="currentColor" /> {(item.averageScore / 10).toFixed(1)}
                </span>
              </div>
              <h3 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.title?.english || item.title?.romaji}
              </h3>
              <p style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {item.status?.replace('_', ' ')}
              </p>
            </Link>
          ))}
        </div>
      )}

      {data && data.length === 0 && !isLoading && debounced && (
        <div style={{ textAlign: 'center', paddingTop: 60, color: 'var(--text-muted)', fontSize: '14px' }}>
          No titles found for "{debounced}"
        </div>
      )}
    </div>
  );
}
