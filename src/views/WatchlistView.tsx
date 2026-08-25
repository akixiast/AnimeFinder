import React, { useState, useEffect } from 'react';
import {
  Bookmark,
  Play,
  Clock,
  Check,
  X,
  Star,
  Plus,
  Minus,
  Search,
  Trash2,
  Tv,
  Sparkles,
} from 'lucide-react';
import { WatchlistItem, WatchStatus } from '../types/anime';
import {
  getWatchlist,
  updateWatchlistItem,
  removeWatchlistItem,
} from '../services/storage';

interface WatchlistViewProps {
  onSelectAnime: (id: number) => void;
  onNavigateBrowse: () => void;
}

export const WatchlistView: React.FC<WatchlistViewProps> = ({
  onSelectAnime,
  onNavigateBrowse,
}) => {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [activeTab, setActiveTab] = useState<WatchStatus | 'all'>('all');
  const [searchFilter, setSearchFilter] = useState('');

  const refreshList = () => {
    setItems(getWatchlist());
  };

  useEffect(() => {
    refreshList();
    window.addEventListener('watchlist_updated', refreshList);
    return () => window.removeEventListener('watchlist_updated', refreshList);
  }, []);

  const handleEpisodeChange = (item: WatchlistItem, delta: number) => {
    const maxEps = item.totalEpisodes || 999;
    const newCount = Math.max(0, Math.min(maxEps, item.watchedEpisodes + delta));
    const newStatus =
      item.totalEpisodes && newCount >= item.totalEpisodes ? 'completed' : item.status;

    updateWatchlistItem(
      {
        id: item.id,
        title: item.title,
        coverImage: item.coverImage,
        format: item.format,
        episodes: item.totalEpisodes,
      },
      newStatus,
      {
        watchedEpisodes: newCount,
        userScore: item.userScore,
        notes: item.notes,
      }
    );
    refreshList();
  };

  const handleStatusChange = (item: WatchlistItem, status: WatchStatus) => {
    updateWatchlistItem(
      {
        id: item.id,
        title: item.title,
        coverImage: item.coverImage,
        format: item.format,
        episodes: item.totalEpisodes,
      },
      status,
      {
        watchedEpisodes: item.watchedEpisodes,
        userScore: item.userScore,
        notes: item.notes,
      }
    );
    refreshList();
  };

  const handleRemove = (id: number) => {
    removeWatchlistItem(id);
    refreshList();
  };

  const filteredItems = items.filter((item) => {
    const matchesTab = activeTab === 'all' || item.status === activeTab;
    const matchesSearch =
      !searchFilter.trim() ||
      item.title.toLowerCase().includes(searchFilter.toLowerCase().trim());
    return matchesTab && matchesSearch;
  });

  const tabCounts = {
    all: items.length,
    watching: items.filter((i) => i.status === 'watching').length,
    plan: items.filter((i) => i.status === 'plan').length,
    completed: items.filter((i) => i.status === 'completed').length,
    dropped: items.filter((i) => i.status === 'dropped').length,
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8 pb-16 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-white/10 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#FF3E00]">
            05 / PERSONAL ARCHIVE
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-display mt-1">
            My Watchlist
          </h1>
        </div>

        {/* Search inside Watchlist */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#FF3E00] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="FILTER WATCHLIST..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-black border border-white/20 rounded-sm text-xs font-mono uppercase text-white placeholder-white/40 focus:outline-none focus:border-white transition"
          />
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'all', label: 'ALL ENTRIES', count: tabCounts.all },
          { id: 'watching', label: 'WATCHING', count: tabCounts.watching },
          { id: 'plan', label: 'PLAN TO WATCH', count: tabCounts.plan },
          { id: 'completed', label: 'COMPLETED', count: tabCounts.completed },
          { id: 'dropped', label: 'DROPPED', count: tabCounts.dropped },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-sm text-xs font-mono font-bold uppercase transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-white text-black border border-white'
                  : 'bg-black hover:bg-white/10 text-white/60 hover:text-white border border-white/20'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 text-[10px] font-mono ${
                  isActive ? 'bg-[#FF3E00] text-white font-bold' : 'bg-white/10 text-white/50'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Items List / Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-16 text-center bg-[#111111] rounded-sm border border-white/10 max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-sm bg-black border border-white/20 text-white/40 flex items-center justify-center mx-auto text-xl font-mono">
            ∅
          </div>
          <h3 className="text-xl font-black uppercase text-white font-display">Watchlist Empty</h3>
          <p className="text-xs uppercase font-mono tracking-wider text-white/50">
            {activeTab === 'all'
              ? 'No anime saved yet. Browse the archive and click Bookmark on any title.'
              : `No titles recorded in the "${activeTab}" status category.`}
          </p>
          <button
            onClick={onNavigateBrowse}
            className="px-6 py-3 bg-white hover:bg-[#FF3E00] text-black hover:text-white rounded-sm text-xs font-black uppercase tracking-widest transition"
          >
            DISCOVER ANIME
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredItems.map((item) => {
            const maxEps = item.totalEpisodes || 0;
            const progressPercent = maxEps > 0 ? (item.watchedEpisodes / maxEps) * 100 : 50;

            return (
              <div
                key={item.id}
                className="group flex gap-4 p-3.5 rounded-sm bg-[#111111] hover:bg-black border border-white/10 hover:border-white/30 transition-all"
              >
                {/* Poster */}
                <div
                  onClick={() => onSelectAnime(item.id)}
                  className="w-20 sm:w-24 aspect-[3/4] shrink-0 rounded-sm overflow-hidden bg-black border border-white/20 cursor-pointer relative"
                >
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {item.userScore && (
                    <div className="absolute top-1 right-1 px-1.5 py-0.2 bg-black text-[9px] font-mono font-bold text-white border border-white/20">
                      ★ {item.userScore}
                    </div>
                  )}
                </div>

                {/* Info & Tracker */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FF3E00]">
                        {item.format || 'TV'}
                      </span>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-white/40 hover:text-[#FF3E00] p-1 transition cursor-pointer"
                        title="Remove from Watchlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4
                      onClick={() => onSelectAnime(item.id)}
                      className="text-sm sm:text-base font-black uppercase tracking-tight text-white truncate cursor-pointer hover:text-[#FF3E00] transition-colors font-display"
                    >
                      {item.title}
                    </h4>

                    {/* Status Pill Selector */}
                    <div className="flex items-center gap-1 mt-2">
                      {(['watching', 'plan', 'completed', 'dropped'] as WatchStatus[]).map(
                        (st) => (
                          <button
                            key={st}
                            onClick={() => handleStatusChange(item, st)}
                            className={`px-2 py-0.5 rounded-none text-[9px] font-mono font-bold uppercase transition-all cursor-pointer ${
                              item.status === st
                                ? 'bg-white text-black'
                                : 'bg-black text-white/50 hover:text-white border border-white/10'
                            }`}
                          >
                            {st === 'plan' ? 'Plan' : st}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  {/* Progress Tracker */}
                  <div className="pt-2 border-t border-white/10 mt-2 space-y-1.5 font-mono">
                    <div className="flex items-center justify-between text-xs text-white/70">
                      <span className="text-[10px] uppercase text-white/40 font-bold">PROGRESS:</span>
                      <span className="font-bold text-white text-xs">
                        {item.watchedEpisodes} / {item.totalEpisodes || '∞'} EPS
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEpisodeChange(item, -1)}
                        disabled={item.watchedEpisodes <= 0}
                        className="p-1 rounded-sm bg-black border border-white/20 hover:bg-white hover:text-black disabled:opacity-20 text-white cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>

                      <div className="flex-1 bg-black border border-white/20 rounded-none overflow-hidden h-1.5">
                        <div
                          className="bg-[#FF3E00] h-full transition-all"
                          style={{ width: `${Math.min(100, progressPercent)}%` }}
                        />
                      </div>

                      <button
                        onClick={() => handleEpisodeChange(item, 1)}
                        disabled={item.totalEpisodes ? item.watchedEpisodes >= item.totalEpisodes : false}
                        className="p-1 rounded-sm bg-black border border-white/20 hover:bg-white hover:text-black disabled:opacity-20 text-white cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {item.notes && (
                      <p className="text-[10px] text-white/40 italic truncate mt-1">
                        &ldquo;{item.notes}&rdquo;
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
