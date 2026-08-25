import React, { useState, useEffect } from 'react';
import {
  Compass,
  Sparkles,
  Calendar,
  Bookmark,
  Shuffle,
  Search,
  Menu,
  X,
  Scale,
  Flame,
} from 'lucide-react';
import { getWatchlist } from '../services/storage';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onOpenSurprise: () => void;
  onOpenSearch: () => void;
  onOpenCompare: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  onOpenSurprise,
  onOpenSearch,
  onOpenCompare,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [watchlistCount, setWatchlistCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      const items = getWatchlist();
      setWatchlistCount(items.length);
    };
    updateCount();
    window.addEventListener('watchlist_updated', updateCount);
    return () => window.removeEventListener('watchlist_updated', updateCount);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: Flame },
    { id: 'browse', label: 'Browse', icon: Compass },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'quiz', label: 'Quiz', icon: Sparkles },
    {
      id: 'watchlist',
      label: 'Watchlist',
      icon: Bookmark,
      badge: watchlistCount > 0 ? watchlistCount : undefined,
    },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <button
          id="btn-brand-logo"
          onClick={() => {
            onNavigate('home');
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-3 group text-left transition-all active:scale-95"
        >
          <div className="w-10 h-10 rounded-sm bg-white text-black flex items-center justify-center font-black text-base tracking-tighter group-hover:bg-[#FF3E00] group-hover:text-white transition-colors">
            AF
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl font-black tracking-[-0.04em] uppercase text-white font-display">
                ANIMEFINDER
              </span>
              <span className="text-[9px] uppercase tracking-[0.3em] font-bold px-1.5 py-0.5 border border-white/20 text-[#FF3E00] bg-white/5 rounded-none">
                01 / EST. 2025
              </span>
            </div>
            <span className="hidden sm:block text-[10px] uppercase tracking-[0.25em] text-white/40 font-medium">
              DATABASE & DISCOVERY ENGINE
            </span>
          </div>
        </button>

        {/* Desktop Navigation links */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => onNavigate(item.id)}
                className={`relative flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] font-bold transition-all py-1.5 ${
                  isActive
                    ? 'text-white border-b-2 border-[#FF3E00]'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 text-[9px] font-mono font-bold ${
                      isActive
                        ? 'bg-[#FF3E00] text-white'
                        : 'bg-white/10 text-white/70 border border-white/20'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right side Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Search Button (Ctrl+K) */}
          <button
            id="btn-quick-search"
            onClick={onOpenSearch}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-sm border border-white/15 hover:border-white text-white/60 hover:text-white bg-white/5 hover:bg-white/10 transition-all text-[11px] uppercase tracking-widest font-bold group"
            title="Search Anime (Ctrl + K)"
          >
            <Search className="w-3.5 h-3.5 text-[#FF3E00]" />
            <span className="hidden md:inline">SEARCH</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.2 text-[9px] font-mono text-white/50 bg-black border border-white/20">
              ⌘K
            </kbd>
          </button>

          {/* Compare Anime Button */}
          <button
            id="btn-nav-compare"
            onClick={onOpenCompare}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-sm border border-white/15 hover:border-white text-white/70 hover:text-white text-[11px] uppercase tracking-widest font-bold transition-all bg-white/5"
            title="Compare 2 Anime"
          >
            <Scale className="w-3.5 h-3.5 text-white/70" />
            <span>COMPARE</span>
          </button>

          {/* Surprise Me / Randomizer Button */}
          <button
            id="btn-surprise-me"
            onClick={onOpenSurprise}
            className="relative group flex items-center gap-2 px-4 py-2 bg-white hover:bg-[#FF3E00] text-black hover:text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-sm transition-all shadow-md active:translate-y-0.5 cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
            <span className="whitespace-nowrap">SURPRISE</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            id="btn-mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-sm border border-white/20 text-white hover:bg-white/10"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#0a0a0a]/98 backdrop-blur-2xl px-6 py-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between py-3 text-left text-xs uppercase tracking-[0.25em] font-black border-b border-white/10 transition-all ${
                  isActive
                    ? 'text-[#FF3E00] border-[#FF3E00]'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#FF3E00] text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-4 grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                onOpenCompare();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 py-3 rounded-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 text-[11px] uppercase tracking-widest font-black"
            >
              <Scale className="w-4 h-4" />
              <span>Compare</span>
            </button>
            <button
              onClick={() => {
                onOpenSearch();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 py-3 rounded-sm bg-[#FF3E00] hover:bg-[#ff551f] text-white text-[11px] uppercase tracking-widest font-black"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
