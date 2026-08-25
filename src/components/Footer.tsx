import React from 'react';
import { Sparkles, Heart, ExternalLink, Compass, Calendar, Bookmark, Shuffle } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenSurprise: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenSurprise }) => {
  return (
    <footer className="border-t border-white/10 mt-auto bg-[#0a0a0a] text-white/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Col 1: Brand */}
          <div className="space-y-4 md:col-span-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-sm bg-white text-black flex items-center justify-center font-black text-sm tracking-tighter">
                AF
              </div>
              <span className="text-lg font-black text-white uppercase tracking-tight font-display">
                ANIMEFINDER
              </span>
              <span className="text-[9px] uppercase tracking-[0.3em] font-mono text-[#FF3E00] border border-white/20 px-1.5 py-0.5">
                DATABASE
              </span>
            </div>
            <p className="text-xs uppercase tracking-wider text-white/50 max-w-md leading-relaxed font-medium">
              High-performance anime discovery & tracking sanctuary. Engineered with the AniList GraphQL API.
            </p>
            <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/30 pt-2">
              BUILD 2025.04 // BOLD TYPOGRAPHY EDITION
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3 md:col-span-3">
            <h4 className="text-[11px] font-black uppercase tracking-[0.25em] text-white">
              DIRECTORY
            </h4>
            <ul className="space-y-2 text-xs uppercase tracking-wider font-bold">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition"
                >
                  01 / Home Showcase
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('browse')}
                  className="hover:text-white transition"
                >
                  02 / Advanced Archive
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('schedule')}
                  className="hover:text-white transition"
                >
                  03 / Airing Schedule
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('quiz')}
                  className="hover:text-white transition"
                >
                  04 / Vibe Quiz
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('watchlist')}
                  className="hover:text-[#FF3E00] transition"
                >
                  05 / Saved Watchlist
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: API & Legal */}
          <div className="space-y-3 md:col-span-3">
            <h4 className="text-[11px] font-black uppercase tracking-[0.25em] text-white">
              SYSTEM
            </h4>
            <ul className="space-y-2 text-xs uppercase tracking-wider font-bold">
              <li>
                <a
                  href="https://anilist.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-white transition"
                >
                  <span>AniList API</span>
                  <ExternalLink className="w-3 h-3 text-[#FF3E00]" />
                </a>
              </li>
              <li>
                <a
                  href="https://graphql.anilist.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-white transition"
                >
                  <span>GraphQL Schema</span>
                  <ExternalLink className="w-3 h-3 text-white/50" />
                </a>
              </li>
              <li className="text-white/30 pt-2 text-[10px] uppercase font-mono leading-normal">
                All media art and character rights belong to their respective animation studios & publishers.
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono uppercase tracking-widest text-white/50 gap-4">
          <div className="flex items-center gap-2">
            <span>&copy; {new Date().getFullYear()} ANIMEFINDER.</span>
            <span className="hidden sm:inline text-white/20">|</span>
            <span className="text-white font-bold tracking-normal">
              Made by <span className="text-[#FF3E00] font-black">AKI</span> for the anime community
            </span>
          </div>
          <div className="flex items-center gap-4 text-[10px] text-white/40">
            <span className="text-[#FF3E00] font-bold">LATENCY &lt; 80MS</span>
            <span>PROPRIETARY LAYOUT</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
