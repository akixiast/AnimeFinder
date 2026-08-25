import React, { useState } from 'react';
import { X, Scale, Search, Star, Tv, Clock, Building, ArrowRight, Loader2 } from 'lucide-react';
import { AnimeMedia } from '../types/anime';
import { quickSearch, fetchAnimeDetails } from '../services/anilist';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAnime: (id: number) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  onSelectAnime,
}) => {
  const [query1, setQuery1] = useState('');
  const [query2, setQuery2] = useState('');
  const [results1, setResults1] = useState<AnimeMedia[]>([]);
  const [results2, setResults2] = useState<AnimeMedia[]>([]);
  const [anime1, setAnime1] = useState<AnimeMedia | null>(null);
  const [anime2, setAnime2] = useState<AnimeMedia | null>(null);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  if (!isOpen) return null;

  const handleSearch1 = async (text: string) => {
    setQuery1(text);
    if (!text.trim()) {
      setResults1([]);
      return;
    }
    setLoading1(true);
    const data = await quickSearch(text);
    setResults1(data);
    setLoading1(false);
  };

  const handleSearch2 = async (text: string) => {
    setQuery2(text);
    if (!text.trim()) {
      setResults2([]);
      return;
    }
    setLoading2(true);
    const data = await quickSearch(text);
    setResults2(data);
    setLoading2(false);
  };

  const selectForSlot1 = async (id: number) => {
    setLoading1(true);
    setResults1([]);
    setQuery1('');
    const full = await fetchAnimeDetails(id);
    setAnime1(full);
    setLoading1(false);
  };

  const selectForSlot2 = async (id: number) => {
    setLoading2(true);
    setResults2([]);
    setQuery2('');
    const full = await fetchAnimeDetails(id);
    setAnime2(full);
    setLoading2(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-5xl bg-[#0a0a0a] border border-white/20 rounded-sm shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col p-6 sm:p-8 animate-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black hover:bg-[#FF3E00] text-white border border-white/20 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
          <div className="w-10 h-10 rounded-none bg-black border border-white/20 text-[#FF3E00] flex items-center justify-center">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-mono font-bold text-[#FF3E00] uppercase tracking-widest">
              ANALYTICS & COMPARISON
            </span>
            <h2 className="text-xl sm:text-2xl font-black uppercase text-white font-display">Compare Anime Side-by-Side</h2>
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pr-1">
          {/* Slot 1 */}
          <div className="p-4 sm:p-5 rounded-sm bg-[#111111] border border-white/10 flex flex-col">
            <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#FF3E00] mb-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#FF3E00]" /> SLOT 01 / CANDIDATE A
            </h3>

            {!anime1 ? (
              <div className="relative space-y-3 font-mono">
                <div className="relative">
                  <Search className="w-4 h-4 text-[#FF3E00] absolute left-3 top-3" />
                  <input
                    type="text"
                    value={query1}
                    onChange={(e) => handleSearch1(e.target.value)}
                    placeholder="SEARCH ANIME 1..."
                    className="w-full pl-9 pr-4 py-2 bg-black border border-white/20 rounded-none text-xs uppercase text-white placeholder-white/40 focus:outline-none focus:border-white"
                  />
                  {loading1 && (
                    <Loader2 className="w-4 h-4 text-[#FF3E00] animate-spin absolute right-3 top-3" />
                  )}
                </div>

                {results1.length > 0 && (
                  <div className="space-y-1 max-h-56 overflow-y-auto bg-black border border-white/20 p-1">
                    {results1.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => selectForSlot1(item.id)}
                        className="flex items-center gap-2.5 p-2 hover:bg-white hover:text-black cursor-pointer text-xs group transition"
                      >
                        <img
                          src={item.coverImage.medium}
                          alt=""
                          className="w-8 h-10 object-cover bg-black border border-white/10"
                        />
                        <div className="min-w-0 flex-1 font-mono">
                          <p className="font-bold text-white group-hover:text-black uppercase truncate">
                            {item.title.english || item.title.romaji}
                          </p>
                          <p className="text-[10px] text-white/50 group-hover:text-black/70">{item.seasonYear || 'UNKNOWN'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex gap-4">
                  <img
                    src={anime1.coverImage.large}
                    alt=""
                    className="w-24 h-32 object-cover rounded-none border border-white/20 shrink-0 bg-black"
                  />
                  <div className="min-w-0 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-black text-base uppercase text-white line-clamp-2 font-display">
                        {anime1.title.english || anime1.title.romaji}
                      </h4>
                      <p className="text-[10px] font-mono uppercase text-white/50 mt-1">{anime1.format} • {anime1.seasonYear}</p>
                    </div>
                    <div className="flex gap-2 font-mono text-[10px] uppercase">
                      <button
                        onClick={() => setAnime1(null)}
                        className="px-2.5 py-1 font-bold bg-black hover:bg-white hover:text-black text-white border border-white/20 cursor-pointer"
                      >
                        Change
                      </button>
                      <button
                        onClick={() => onSelectAnime(anime1.id)}
                        className="px-2.5 py-1 font-bold bg-white text-black hover:bg-[#FF3E00] hover:text-white cursor-pointer"
                      >
                        Full Record
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs divide-y divide-white/10 pt-2 border-t border-white/10 font-mono">
                  <div className="flex justify-between py-1.5">
                    <span className="text-white/40 uppercase">SCORE:</span>
                    <span className="font-bold text-white">
                      {anime1.averageScore ? `${anime1.averageScore}%` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-white/40 uppercase">EPISODES:</span>
                    <span className="font-bold text-white">{anime1.episodes || 'UNKNOWN'}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-white/40 uppercase">STUDIO:</span>
                    <span className="font-bold text-white truncate max-w-[150px]">
                      {anime1.studios?.nodes?.map((s) => s.name).join(', ') || 'UNKNOWN'}
                    </span>
                  </div>
                  <div className="py-1.5">
                    <span className="text-white/40 block mb-1 uppercase">GENRES:</span>
                    <div className="flex flex-wrap gap-1">
                      {anime1.genres.map((g) => (
                        <span key={g} className="px-1.5 py-0.5 bg-black border border-white/15 text-[9px] font-mono uppercase text-white/70">
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Slot 2 */}
          <div className="p-4 sm:p-5 rounded-sm bg-[#111111] border border-white/10 flex flex-col">
            <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#FF3E00] mb-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#FF3E00]" /> SLOT 02 / CANDIDATE B
            </h3>

            {!anime2 ? (
              <div className="relative space-y-3 font-mono">
                <div className="relative">
                  <Search className="w-4 h-4 text-[#FF3E00] absolute left-3 top-3" />
                  <input
                    type="text"
                    value={query2}
                    onChange={(e) => handleSearch2(e.target.value)}
                    placeholder="SEARCH ANIME 2..."
                    className="w-full pl-9 pr-4 py-2 bg-black border border-white/20 rounded-none text-xs uppercase text-white placeholder-white/40 focus:outline-none focus:border-white"
                  />
                  {loading2 && (
                    <Loader2 className="w-4 h-4 text-[#FF3E00] animate-spin absolute right-3 top-3" />
                  )}
                </div>

                {results2.length > 0 && (
                  <div className="space-y-1 max-h-56 overflow-y-auto bg-black border border-white/20 p-1">
                    {results2.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => selectForSlot2(item.id)}
                        className="flex items-center gap-2.5 p-2 hover:bg-white hover:text-black cursor-pointer text-xs group transition"
                      >
                        <img
                          src={item.coverImage.medium}
                          alt=""
                          className="w-8 h-10 object-cover bg-black border border-white/10"
                        />
                        <div className="min-w-0 flex-1 font-mono">
                          <p className="font-bold text-white group-hover:text-black uppercase truncate">
                            {item.title.english || item.title.romaji}
                          </p>
                          <p className="text-[10px] text-white/50 group-hover:text-black/70">{item.seasonYear || 'UNKNOWN'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex gap-4">
                  <img
                    src={anime2.coverImage.large}
                    alt=""
                    className="w-24 h-32 object-cover rounded-none border border-white/20 shrink-0 bg-black"
                  />
                  <div className="min-w-0 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-black text-base uppercase text-white line-clamp-2 font-display">
                        {anime2.title.english || anime2.title.romaji}
                      </h4>
                      <p className="text-[10px] font-mono uppercase text-white/50 mt-1">{anime2.format} • {anime2.seasonYear}</p>
                    </div>
                    <div className="flex gap-2 font-mono text-[10px] uppercase">
                      <button
                        onClick={() => setAnime2(null)}
                        className="px-2.5 py-1 font-bold bg-black hover:bg-white hover:text-black text-white border border-white/20 cursor-pointer"
                      >
                        Change
                      </button>
                      <button
                        onClick={() => onSelectAnime(anime2.id)}
                        className="px-2.5 py-1 font-bold bg-white text-black hover:bg-[#FF3E00] hover:text-white cursor-pointer"
                      >
                        Full Record
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs divide-y divide-white/10 pt-2 border-t border-white/10 font-mono">
                  <div className="flex justify-between py-1.5">
                    <span className="text-white/40 uppercase">SCORE:</span>
                    <span className="font-bold text-white">
                      {anime2.averageScore ? `${anime2.averageScore}%` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-white/40 uppercase">EPISODES:</span>
                    <span className="font-bold text-white">{anime2.episodes || 'UNKNOWN'}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-white/40 uppercase">STUDIO:</span>
                    <span className="font-bold text-white truncate max-w-[150px]">
                      {anime2.studios?.nodes?.map((s) => s.name).join(', ') || 'UNKNOWN'}
                    </span>
                  </div>
                  <div className="py-1.5">
                    <span className="text-white/40 block mb-1 uppercase">GENRES:</span>
                    <div className="flex flex-wrap gap-1">
                      {anime2.genres.map((g) => (
                        <span key={g} className="px-1.5 py-0.5 bg-black border border-white/15 text-[9px] font-mono uppercase text-white/70">
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
