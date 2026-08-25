import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Star, Calendar, ArrowRight, Loader2, Play } from 'lucide-react';
import { AnimeMedia } from '../types/anime';
import { quickSearch } from '../services/anilist';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAnime: (id: number) => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectAnime,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AnimeMedia[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const handler = setTimeout(async () => {
      const data = await quickSearch(query);
      setResults(data);
      setLoading(false);
      setSelectedIndex(0);
    }, 350);

    return () => clearTimeout(handler);
  }, [query]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      if (results[selectedIndex]) {
        onSelectAnime(results[selectedIndex].id);
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-2xl bg-[#0a0a0a] border border-white/20 rounded-none shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
        onKeyDown={handleKeyDown}
      >
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 gap-3 bg-black">
          <Search className="w-5 h-5 text-[#FF3E00] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="TYPE ANIME TITLE (E.G. DEATH NOTE, FREEREN, ATTACK ON TITAN)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-white placeholder-white/30 text-sm uppercase font-mono tracking-wider focus:outline-none"
          />
          {loading && <Loader2 className="w-4 h-4 text-[#FF3E00] animate-spin shrink-0" />}
          {query && !loading && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-white/50 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-0.5 text-[10px] font-mono uppercase bg-black text-white/50 hover:text-white border border-white/20 cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 divide-y divide-white/5">
          {query.trim().length === 0 ? (
            <div className="py-12 text-center text-white/40 font-mono text-xs uppercase tracking-wider">
              <p className="font-bold text-white mb-1">SEARCH THE DATABASE BY TITLE OR KEYWORD</p>
              <p className="text-[10px] text-white/40">
                USE <kbd className="px-1 py-0.5 bg-black border border-white/20 text-white">↑</kbd>{' '}
                <kbd className="px-1 py-0.5 bg-black border border-white/20 text-white">↓</kbd> TO NAVIGATE,{' '}
                <kbd className="px-1 py-0.5 bg-black border border-white/20 text-white">ENTER</kbd> TO SELECT.
              </p>
            </div>
          ) : results.length === 0 && !loading ? (
            <div className="py-12 text-center text-white/40 font-mono">
              <p className="font-bold text-sm uppercase text-[#FF3E00] mb-1">NO ANIME FOUND FOR &quot;{query}&quot;</p>
              <p className="text-[10px] text-white/40 uppercase">CHECK QUERY SPELLING OR TRY A SHORTER KEYWORD.</p>
            </div>
          ) : (
            results.map((anime, index) => {
              const isSelected = index === selectedIndex;
              const title = anime.title.english || anime.title.romaji || 'Unknown';
              const score = anime.averageScore;

              return (
                <div
                  key={anime.id}
                  onClick={() => {
                    onSelectAnime(anime.id);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center gap-3.5 p-2.5 rounded-none cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white text-black font-bold'
                      : 'hover:bg-white/5 text-white/80'
                  }`}
                >
                  <img
                    src={anime.coverImage.medium || anime.coverImage.large}
                    alt={title}
                    className="w-12 h-16 object-cover bg-black border border-white/10 shrink-0"
                  />

                  <div className="flex-1 min-w-0 font-mono">
                    <div className="flex items-center gap-2">
                      <h4 className={`font-bold text-xs uppercase truncate ${isSelected ? 'text-black' : 'text-white'}`}>{title}</h4>
                      {anime.format && (
                        <span className={`px-1 py-0.5 text-[9px] font-bold border shrink-0 ${isSelected ? 'bg-black text-white border-black' : 'bg-black text-white/60 border-white/20'}`}>
                          {anime.format}
                        </span>
                      )}
                    </div>

                    <div className={`flex items-center gap-3 text-[10px] mt-1 ${isSelected ? 'text-black/70' : 'text-white/50'}`}>
                      {anime.seasonYear && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {anime.seasonYear}
                        </span>
                      )}
                      {score && (
                        <span className="flex items-center gap-1 font-bold">
                          <Star className="w-3 h-3 fill-current" />
                          {score}%
                        </span>
                      )}
                      {anime.genres && anime.genres.length > 0 && (
                        <span className="truncate hidden sm:inline">
                          {anime.genres.slice(0, 3).join(' • ')}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center pr-2 font-mono">
                    {isSelected ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-black uppercase">
                        OPEN <ArrowRight className="w-3 h-3 text-[#FF3E00]" />
                      </span>
                    ) : (
                      <Play className="w-3 h-3 text-white/30" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {results.length > 0 && (
          <div className="px-4 py-2 bg-black border-t border-white/10 text-[10px] font-mono uppercase text-white/40 flex justify-between items-center">
            <span>
              {results.length} MATCHES FOR &quot;{query}&quot;
            </span>
            <span>PRESS ENTER TO VIEW</span>
          </div>
        )}
      </div>
    </div>
  );
};
