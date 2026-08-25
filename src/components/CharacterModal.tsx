import React, { useState, useEffect } from 'react';
import { X, User, Heart, ExternalLink, Calendar, Droplets } from 'lucide-react';
import { CharacterDetail } from '../types/anime';
import { fetchCharacterDetails } from '../services/anilist';

interface CharacterModalProps {
  characterId: number | null;
  onClose: () => void;
}

export const CharacterModal: React.FC<CharacterModalProps> = ({ characterId, onClose }) => {
  const [character, setCharacter] = useState<CharacterDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!characterId) return;

    let isMounted = true;
    setLoading(true);

    fetchCharacterDetails(characterId).then((data) => {
      if (!isMounted) return;
      setCharacter(data);
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [characterId]);

  if (!characterId) return null;

  const cleanDescription = (desc?: string) => {
    if (!desc) return 'No character biography available.';
    return desc.replace(/<br\s*[\/]?>/gi, '\n').replace(/<\/?[^>]+(>|$)/g, '');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/20 rounded-sm shadow-2xl overflow-hidden max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-black hover:bg-[#FF3E00] text-white border border-white/20 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center min-h-[300px] gap-3">
            <div className="w-8 h-8 border-2 border-white/20 border-t-[#FF3E00] rounded-full animate-spin" />
            <p className="text-white/50 text-xs font-mono uppercase tracking-widest animate-pulse">FETCHING CHARACTER DOSSIER...</p>
          </div>
        ) : !character ? (
          <div className="p-8 text-center text-rose-400">
            <p className="font-mono text-xs uppercase">Could not load character details.</p>
            <button onClick={onClose} className="mt-3 px-4 py-1.5 bg-white text-black font-bold text-xs uppercase font-mono rounded-sm">
              Close
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row overflow-y-auto">
            {/* Character Image Sidebar */}
            <div className="sm:w-2/5 shrink-0 bg-black relative aspect-[3/4] sm:aspect-auto border-b sm:border-b-0 sm:border-r border-white/10">
              <img
                src={character.image.large}
                alt={character.name.full}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Character Info */}
            <div className="p-6 sm:p-8 flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <div className="mb-4">
                  <span className="text-[9px] font-mono font-bold text-[#FF3E00] uppercase tracking-widest">
                    CHARACTER DOSSIER
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black uppercase text-white font-display mt-0.5">
                    {character.name.full}
                  </h2>
                  {character.name.native && (
                    <p className="text-xs font-mono text-white/50 mt-0.5">
                      {character.name.native}
                    </p>
                  )}
                  {character.name.alternative && character.name.alternative.length > 0 && (
                    <p className="text-[10px] font-mono text-white/40 mt-1 uppercase">
                      AKA: {character.name.alternative.slice(0, 3).join(', ')}
                    </p>
                  )}
                </div>

                {/* Attribute Pills */}
                <div className="flex flex-wrap gap-1.5 mb-4 font-mono text-[10px] uppercase">
                  {character.age && (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-black border border-white/20 text-white/80">
                      Age: {character.age}
                    </span>
                  )}
                  {character.gender && (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-black border border-white/20 text-white/80">
                      Gender: {character.gender}
                    </span>
                  )}
                  {character.bloodType && (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-black border border-white/20 text-white/80">
                      Blood: {character.bloodType}
                    </span>
                  )}
                  {character.dateOfBirth?.month && character.dateOfBirth?.day && (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-black border border-white/20 text-white/80">
                      DOB: {character.dateOfBirth.month}/{character.dateOfBirth.day}
                    </span>
                  )}
                </div>

                {/* Bio text */}
                <div className="bg-[#111111] p-4 rounded-sm border border-white/10 max-h-56 overflow-y-auto text-xs text-white/70 leading-relaxed whitespace-pre-line font-sans">
                  {cleanDescription(character.description)}
                </div>
              </div>

              {character.siteUrl && (
                <div className="pt-4 mt-4 border-t border-white/10 flex justify-end">
                  <a
                    href={character.siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-white hover:text-[#FF3E00] transition-colors"
                  >
                    AniList Bio <ExternalLink className="w-3.5 h-3.5 text-[#FF3E00]" />
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
