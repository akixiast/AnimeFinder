import React, { useState, useEffect } from 'react';
import { Star, Play, Bookmark, Check, Plus, Clock } from 'lucide-react';
import { AnimeMedia, WatchStatus } from '../types/anime';
import { getWatchlistStatus, updateWatchlistItem, removeWatchlistItem } from '../services/storage';

interface AnimeCardProps {
  anime: AnimeMedia;
  index?: number;
  onClick: () => void;
  onCompareSelect?: () => void;
  isCompareMode?: boolean;
}

export const AnimeCard: React.FC<AnimeCardProps> = ({
  anime,
  index = 0,
  onClick,
}) => {
  const [watchStatus, setWatchStatus] = useState<WatchStatus | null>(null);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  useEffect(() => {
    setWatchStatus(getWatchlistStatus(anime.id));
  }, [anime.id]);

  const title = anime.title?.english || anime.title?.romaji || anime.title?.native || 'Unknown Title';
  const image =
    anime.coverImage?.extraLarge ||
    anime.coverImage?.large ||
    anime.coverImage?.medium ||
    'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=400&q=80';
  const score = anime.averageScore ? Math.round(anime.averageScore) : null;
  const year = anime.seasonYear || anime.startDate?.year || '';

  let scoreBadgeColor = 'bg-slate-900/80 text-slate-300 border-slate-700';
  let starColor = 'text-slate-400 fill-slate-400';
  if (score && score >= 80) {
    scoreBadgeColor = 'bg-emerald-950/85 text-emerald-300 border-emerald-500/40';
    starColor = 'text-emerald-400 fill-emerald-400';
  } else if (score && score >= 70) {
    scoreBadgeColor = 'bg-yellow-950/85 text-yellow-300 border-yellow-500/40';
    starColor = 'text-yellow-400 fill-yellow-400';
  } else if (score) {
    scoreBadgeColor = 'bg-orange-950/85 text-orange-300 border-orange-500/40';
    starColor = 'text-orange-400 fill-orange-400';
  }

  const handleStatusChange = (e: React.MouseEvent, status: WatchStatus | 'remove') => {
    e.stopPropagation();
    if (status === 'remove') {
      removeWatchlistItem(anime.id);
      setWatchStatus(null);
    } else {
      updateWatchlistItem(anime, status);
      setWatchStatus(status);
    }
    setShowStatusMenu(false);
  };

  const getStatusBadge = () => {
    if (!watchStatus) return null;
    switch (watchStatus) {
      case 'watching':
        return { label: 'Watching', color: 'bg-indigo-600 text-white' };
      case 'plan':
        return { label: 'Plan to Watch', color: 'bg-amber-600 text-white' };
      case 'completed':
        return { label: 'Completed', color: 'bg-emerald-600 text-white' };
      case 'dropped':
        return { label: 'Dropped', color: 'bg-rose-600 text-white' };
    }
  };

  const activeBadge = getStatusBadge();

  return (
    <div
      id={`anime-card-${anime.id}`}
      onClick={onClick}
      className="group relative flex flex-col w-full h-full bg-[#111111] rounded-sm overflow-hidden border border-white/10 hover:border-[#FF3E00] transition-all duration-200 cursor-pointer select-none"
      style={{ animationDelay: `${(index % 12) * 40}ms` }}
    >
      {/* Poster Image Box */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-black">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
        />

        {/* Gradient Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-black/40 opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-2 inset-x-2 flex items-center justify-between pointer-events-none z-10">
          {/* Format Badge */}
          <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider bg-black/90 text-white border border-white/20">
            {anime.format || 'TV'}
          </span>

          {/* AniList Score Badge */}
          {score !== null ? (
            <div className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono font-bold bg-black/90 text-white border border-white/20">
              <span className="text-[#FF3E00]">★</span>
              <span>{score}%</span>
            </div>
          ) : (
            <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-black/80 text-white/50 border border-white/10">
              TBA
            </span>
          )}
        </div>

        {/* Watchlist status tag if present */}
        {activeBadge && (
          <div className="absolute bottom-2 left-2 z-10">
            <span
              className={`px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider ${activeBadge.color}`}
            >
              {activeBadge.label}
            </span>
          </div>
        )}

        {/* Center Hover View Details Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 bg-black/50">
          <div className="flex flex-col items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200">
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-sm shadow-2xl">
              <Play className="w-3 h-3 fill-black text-black" /> VIEW
            </span>
          </div>
        </div>

        {/* Quick Add To Watchlist Button on Card Bottom Right */}
        <div className="absolute bottom-2 right-2 z-20">
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowStatusMenu(!showStatusMenu);
              }}
              className={`p-1.5 rounded-sm border transition-all ${
                watchStatus
                  ? 'bg-[#FF3E00] text-white border-[#FF3E00]'
                  : 'bg-black/90 hover:bg-white hover:text-black text-white border-white/20'
              }`}
              title="Bookmark / Watchlist"
            >
              {watchStatus ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Bookmark className="w-3.5 h-3.5" />}
            </button>

            {/* Status Dropdown */}
            {showStatusMenu && (
              <div
                className="absolute bottom-full right-0 mb-2 w-44 bg-[#0a0a0a] border border-white/20 rounded-sm shadow-2xl p-1 z-30 flex flex-col gap-1 text-xs"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-2 py-1 text-[9px] font-mono font-bold text-white/50 uppercase tracking-widest border-b border-white/10">
                  TRACK STATUS
                </div>
                <button
                  onClick={(e) => handleStatusChange(e, 'watching')}
                  className={`flex items-center gap-2 px-2.5 py-1.5 text-left text-[11px] font-bold uppercase tracking-wider transition-colors ${
                    watchStatus === 'watching'
                      ? 'bg-white text-black'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Play className="w-3 h-3 text-[#FF3E00]" /> Watching
                </button>
                <button
                  onClick={(e) => handleStatusChange(e, 'plan')}
                  className={`flex items-center gap-2 px-2.5 py-1.5 text-left text-[11px] font-bold uppercase tracking-wider transition-colors ${
                    watchStatus === 'plan'
                      ? 'bg-white text-black'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Clock className="w-3 h-3 text-white/60" /> Plan to Watch
                </button>
                <button
                  onClick={(e) => handleStatusChange(e, 'completed')}
                  className={`flex items-center gap-2 px-2.5 py-1.5 text-left text-[11px] font-bold uppercase tracking-wider transition-colors ${
                    watchStatus === 'completed'
                      ? 'bg-white text-black'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Check className="w-3 h-3 text-emerald-400" /> Completed
                </button>
                {watchStatus && (
                  <button
                    onClick={(e) => handleStatusChange(e, 'remove')}
                    className="flex items-center gap-2 px-2.5 py-1.5 text-left text-[11px] font-bold uppercase tracking-wider text-rose-400 hover:bg-rose-950/40 font-mono transition-colors border-t border-white/10 mt-0.5"
                  >
                    <Plus className="w-3 h-3 rotate-45" /> Remove
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Content info */}
      <div className="p-3 flex flex-col flex-grow justify-between gap-2">
        <div>
          <h3
            className="font-black text-xs uppercase tracking-tight text-white line-clamp-2 leading-snug group-hover:text-[#FF3E00] transition-colors font-display"
            title={title}
          >
            {title}
          </h3>

          {/* Genre tags preview */}
          {anime.genres && anime.genres.length > 0 && (
            <p className="text-[10px] font-mono uppercase tracking-wider text-white/40 mt-1 truncate">
              {anime.genres.slice(0, 2).join(' / ')}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[10px] font-mono text-white/50">
          <span>{year || 'TBA'}</span>
          <span>{anime.episodes ? `${anime.episodes} EPS` : 'ONGOING'}</span>
        </div>
      </div>
    </div>
  );
};
