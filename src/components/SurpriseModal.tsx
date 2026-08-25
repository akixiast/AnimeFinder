import React, { useState, useEffect } from 'react';
import { X, Shuffle, Sliders, Sparkles, Star, Film, Flame, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GENRES_LIST, fetchRandomAnime } from '../services/anilist';
import { getSurpriseSettings, saveSurpriseSettings } from '../services/storage';
import { SurpriseSettings } from '../types/anime';

interface SurpriseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAnime: (id: number) => void;
}

export const SurpriseModal: React.FC<SurpriseModalProps> = ({
  isOpen,
  onClose,
  onSelectAnime,
}) => {
  const [settings, setSettings] = useState<SurpriseSettings>({
    genre: '',
    format: '',
    minScore: '75',
    year: '',
  });
  const [isRolling, setIsRolling] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSettings(getSurpriseSettings());
      setErrorMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRoll = async () => {
    setIsRolling(true);
    setErrorMessage('');
    saveSurpriseSettings(settings);

    try {
      const anime = await fetchRandomAnime({
        genre: settings.genre || undefined,
        format: settings.format || undefined,
        minScore: settings.minScore || undefined,
      });

      if (anime) {
        // Trigger celebratory confetti burst
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#ec4899', '#a855f7', '#38bdf8', '#fbbf24'],
        });

        setTimeout(() => {
          setIsRolling(false);
          onSelectAnime(anime.id);
          onClose();
        }, 500);
      } else {
        setIsRolling(false);
        setErrorMessage('No anime found matching those filter criteria. Try relaxing your filters!');
      }
    } catch (e) {
      console.error(e);
      setIsRolling(false);
      setErrorMessage('Something went wrong rolling the randomizer.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isRolling) onClose();
      }}
    >
      <div className="relative w-full max-w-md bg-[#0a0a0a] border border-white/20 rounded-sm shadow-2xl overflow-hidden p-6 sm:p-8 animate-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isRolling}
          className="absolute top-4 right-4 p-2 bg-black hover:bg-[#FF3E00] text-white border border-white/20 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
          <div className="w-10 h-10 rounded-none bg-[#FF3E00] flex items-center justify-center text-white font-bold">
            <Shuffle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-mono font-bold text-[#FF3E00] uppercase tracking-widest">
              DISCOVERY PROTOCOL
            </span>
            <h2 className="text-xl font-black uppercase text-white font-display">Surprise Randomizer</h2>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="space-y-4">
          {/* Genre Selection */}
          <div>
            <label className="block text-[10px] font-mono font-bold text-white/50 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#FF3E00]" /> GENRE PREFERENCE
            </label>
            <select
              value={settings.genre}
              onChange={(e) => setSettings({ ...settings, genre: e.target.value })}
              className="w-full bg-black border border-white/20 rounded-none px-3 py-2 text-xs font-mono uppercase text-white focus:outline-none focus:border-white"
            >
              <option value="">Any Genre (Total Mystery)</option>
              {GENRES_LIST.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Format Selection */}
          <div>
            <label className="block text-[10px] font-mono font-bold text-white/50 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#FF3E00]" /> FORMAT
            </label>
            <div className="grid grid-cols-4 gap-1 font-mono text-[10px] uppercase">
              {[
                { id: '', label: 'ANY' },
                { id: 'TV', label: 'TV' },
                { id: 'MOVIE', label: 'MOVIE' },
                { id: 'OVA', label: 'OVA' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSettings({ ...settings, format: item.id })}
                  className={`py-2 px-1 rounded-none font-bold border transition-all cursor-pointer ${
                    settings.format === item.id
                      ? 'bg-white text-black border-white'
                      : 'bg-black border-white/20 text-white/60 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Minimum Rating Threshold */}
          <div>
            <label className="block text-[10px] font-mono font-bold text-white/50 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#FF3E00]" /> QUALITY BAR (MIN SCORE)
            </label>
            <div className="grid grid-cols-4 gap-1 font-mono text-[10px] uppercase">
              {[
                { id: '', label: 'ANY' },
                { id: '70', label: '70%+' },
                { id: '75', label: '75%+' },
                { id: '80', label: '80%+' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSettings({ ...settings, minScore: item.id })}
                  className={`py-2 px-1 rounded-none font-bold border transition-all cursor-pointer ${
                    settings.minScore === item.id
                      ? 'bg-[#FF3E00] text-white border-[#FF3E00]'
                      : 'bg-black border-white/20 text-white/60 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {errorMessage && (
          <p className="mt-4 text-xs font-mono uppercase text-[#FF3E00] text-center bg-black p-2.5 border border-[#FF3E00]/40">
            {errorMessage}
          </p>
        )}

        {/* Roll Button */}
        <button
          id="btn-roll-random-anime"
          onClick={handleRoll}
          disabled={isRolling}
          className="mt-6 w-full py-3.5 px-6 rounded-none bg-white hover:bg-[#FF3E00] text-black hover:text-white font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer font-mono disabled:opacity-50"
        >
          {isRolling ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>SPINNING RANDOMIZER...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>ROLL A RANDOM ANIME</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
