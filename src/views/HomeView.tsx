import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Search,
  Compass,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  Flame,
  Award,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { AnimeMedia } from '../types/anime';
import { getHomeFeed, GENRES_LIST } from '../services/anilist';
import { AnimeCard } from '../components/AnimeCard';

interface HomeViewProps {
  onNavigate: (tab: string, filterState?: any) => void;
  onSelectAnime: (id: number) => void;
  onOpenSurprise: () => void;
  onOpenSearch: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onSelectAnime,
  onOpenSurprise,
  onOpenSearch,
}) => {
  const [feed, setFeed] = useState<{
    trending: AnimeMedia[];
    upcoming: AnimeMedia[];
    topRated: AnimeMedia[];
    popular: AnimeMedia[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const trendingRef = useRef<HTMLDivElement>(null);
  const popularRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    getHomeFeed().then((data) => {
      if (!isMounted) return;
      setFeed(data);
      setLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const scrollContainer = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmt = ref.current.clientWidth * 0.75;
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmt : scrollAmt,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="space-y-20 pb-20 animate-in fade-in duration-300">
      {/* Hero Section */}
      <section className="relative pt-8 sm:pt-14 pb-12 text-left max-w-7xl mx-auto px-4 sm:px-6 flex flex-col">
        {/* Subtle Horizontal Hairline Axis */}
        <div className="w-full h-[1px] bg-white/10 mb-8" />

        {/* Live Badge Tag */}
        <div className="flex items-center gap-4 mb-4">
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#FF3E00]">
            01 / LIVE ANILIST DISCOVERY ENGINE
          </span>
          <div className="h-[1px] w-24 bg-white/20 hidden sm:block" />
        </div>

        {/* Hero Headline */}
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight uppercase leading-tight text-white font-display">
            Discover Your Next
          </h1>
          <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight uppercase leading-tight text-[#FF3E00] font-display">
            Obsession
          </span>
        </div>

        {/* Hero Paragraph & Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 pt-5 border-t border-white/10 items-center">
          <p className="lg:col-span-7 text-xs sm:text-sm text-white/60 leading-relaxed font-sans">
            Explore 10,000+ anime titles with curated data, real-time weekly broadcasting schedules, 
            interactive vibe matching quizzes, and instant side-by-side comparisons.
          </p>

          <div className="lg:col-span-5 flex flex-wrap items-center lg:justify-end gap-3">
            <button
              onClick={() => onNavigate('quiz')}
              className="flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-[#FF3E00] text-black hover:text-white font-black text-xs uppercase tracking-[0.25em] rounded-sm transition-all shadow-xl active:translate-y-0.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>START QUIZ</span>
            </button>

            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-5 py-3.5 bg-white/5 hover:bg-white/15 text-white border border-white/20 hover:border-white font-bold text-xs uppercase tracking-[0.25em] rounded-sm transition-all"
            >
              <Search className="w-4 h-4 text-[#FF3E00]" />
              <span>SEARCH (⌘K)</span>
            </button>
          </div>
        </div>

        {/* Feature Cards Trio with Editorial Numbers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-12">
          {/* Card 1: Quiz */}
          <div
            onClick={() => onNavigate('quiz')}
            className="group glass-card p-6 sm:p-7 rounded-sm border border-white/10 hover:border-[#FF3E00] cursor-pointer transition-all duration-200"
          >
            <div className="flex justify-between items-start mb-6">
              <span className="text-xs font-mono font-bold text-[#FF3E00] tracking-widest">
                [01] // VIBE QUIZ
              </span>
              <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-[#FF3E00] group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight text-white group-hover:text-[#FF3E00] transition-colors font-display">
              Interactive Matcher
            </h3>
            <p className="text-xs text-white/50 mt-2 leading-relaxed">
              Answer 5 curated questions tailored to your mood to calculate your perfect anime recommendation.
            </p>
          </div>

          {/* Card 2: Browse */}
          <div
            onClick={() => onNavigate('browse')}
            className="group glass-card p-6 sm:p-7 rounded-sm border border-white/10 hover:border-white cursor-pointer transition-all duration-200"
          >
            <div className="flex justify-between items-start mb-6">
              <span className="text-xs font-mono font-bold text-white/60 tracking-widest">
                [02] // ADVANCED FILTER
              </span>
              <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight text-white transition-colors font-display">
              Full Archive
            </h3>
            <p className="text-xs text-white/50 mt-2 leading-relaxed">
              Filter by 18+ genres, formats (TV/Movie/OVA), release seasons, and verified AniList community scores.
            </p>
          </div>

          {/* Card 3: Surprise */}
          <div
            onClick={onOpenSurprise}
            className="group glass-card p-6 sm:p-7 rounded-sm border border-white/10 hover:border-[#FF3E00] cursor-pointer transition-all duration-200"
          >
            <div className="flex justify-between items-start mb-6">
              <span className="text-xs font-mono font-bold text-[#FF3E00] tracking-widest">
                [03] // RANDOMIZER
              </span>
              <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-[#FF3E00] group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight text-white group-hover:text-[#FF3E00] transition-colors font-display">
              Surprise Spinner
            </h3>
            <p className="text-xs text-white/50 mt-2 leading-relaxed">
              Indecisive? Spin the anime roulette with score thresholds to instantly find your next marathon.
            </p>
          </div>
        </div>
      </section>

      {/* Upcoming Hype Marquee (Auto-scrolling) */}
      <section className="space-y-4 border-t border-b border-white/10 py-8 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#FF3E00]">
              02 / ANTICIPATED
            </span>
            <h2 className="text-lg sm:text-2xl font-black uppercase tracking-tight text-white font-display">
              Upcoming Hype Broadcasts
            </h2>
          </div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-white/40 font-bold hidden sm:inline">
            Airing Soon
          </span>
        </div>

        <div className="marquee-container w-full overflow-hidden py-2">
          <div className="marquee-content gap-4 pl-4">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="w-44 sm:w-52 h-72 rounded-sm bg-white/5 animate-pulse shrink-0 border border-white/10"
                />
              ))
            ) : feed?.upcoming ? (
              [...feed.upcoming, ...feed.upcoming, ...feed.upcoming].map((anime, idx) => (
                <div
                  key={`${anime.id}-${idx}`}
                  onClick={() => onSelectAnime(anime.id)}
                  className="w-44 sm:w-52 shrink-0 aspect-[3/4] relative rounded-sm overflow-hidden cursor-pointer group bg-black border border-white/10 hover:border-white transition-all duration-300"
                >
                  <img
                    src={anime.coverImage.large || anime.coverImage.medium}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3.5">
                    <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase bg-[#FF3E00] text-white mb-1.5 inline-block">
                      {anime.format || 'TV'}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold uppercase tracking-tight text-white line-clamp-2 leading-tight font-display">
                      {anime.title.english || anime.title.romaji}
                    </h4>
                  </div>
                </div>
              ))
            ) : null}
          </div>
        </div>
      </section>

      {/* Critically Acclaimed Marquee (Reverse auto-scrolling) */}
      <section className="space-y-4 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/50">
              03 / MASTERPIECES
            </span>
            <h2 className="text-lg sm:text-2xl font-black uppercase tracking-tight text-white font-display">
              Critically Acclaimed
            </h2>
          </div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-white/40 font-bold hidden sm:inline">
            Top AniList Scores
          </span>
        </div>

        <div className="marquee-container w-full overflow-hidden py-2">
          <div className="marquee-content reverse gap-4 pl-4">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="w-44 sm:w-52 h-72 rounded-sm bg-white/5 animate-pulse shrink-0 border border-white/10"
                />
              ))
            ) : feed?.topRated ? (
              [...feed.topRated, ...feed.topRated, ...feed.topRated].map((anime, idx) => (
                <div
                  key={`${anime.id}-${idx}`}
                  onClick={() => onSelectAnime(anime.id)}
                  className="w-44 sm:w-52 shrink-0 aspect-[3/4] relative rounded-sm overflow-hidden cursor-pointer group bg-black border border-white/10 hover:border-[#FF3E00] transition-all duration-300"
                >
                  <img
                    src={anime.coverImage.large || anime.coverImage.medium}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute top-2.5 right-2.5">
                    <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-black/90 text-white border border-white/20">
                      ★ {anime.averageScore}%
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3.5">
                    <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase bg-white/15 text-white/80 mb-1.5 inline-block">
                      {anime.seasonYear || anime.format}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold uppercase tracking-tight text-white line-clamp-2 leading-tight font-display">
                      {anime.title.english || anime.title.romaji}
                    </h4>
                  </div>
                </div>
              ))
            ) : null}
          </div>
        </div>
      </section>

      {/* Trending Now Slider Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6 pt-6 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#FF3E00]">
              04 / TRENDING
            </span>
            <h2 className="text-xl sm:text-3xl font-black uppercase tracking-tight text-white font-display">
              Trending This Season
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollContainer(trendingRef, 'left')}
              className="p-2.5 rounded-sm bg-white/5 border border-white/15 hover:border-white hover:bg-white hover:text-black text-white transition"
              aria-label="Previous Trending"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollContainer(trendingRef, 'right')}
              className="p-2.5 rounded-sm bg-white/5 border border-white/15 hover:border-white hover:bg-white hover:text-black text-white transition"
              aria-label="Next Trending"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          ref={trendingRef}
          className="flex gap-4 sm:gap-5 overflow-x-auto scroll-smooth no-scrollbar pb-4 snap-x"
        >
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="w-48 sm:w-56 aspect-[3/4] rounded-sm bg-white/5 animate-pulse shrink-0 border border-white/10"
                />
              ))
            : feed?.trending.map((anime, idx) => (
                <div key={anime.id} className="w-48 sm:w-56 shrink-0 snap-start">
                  <AnimeCard
                    anime={anime}
                    index={idx}
                    onClick={() => onSelectAnime(anime.id)}
                  />
                </div>
              ))}
        </div>
      </section>

      {/* All Time Popular Slider Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6 pt-6 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/50">
              05 / POPULAR
            </span>
            <h2 className="text-xl sm:text-3xl font-black uppercase tracking-tight text-white font-display">
              All-Time Fan Favorites
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollContainer(popularRef, 'left')}
              className="p-2.5 rounded-sm bg-white/5 border border-white/15 hover:border-white hover:bg-white hover:text-black text-white transition"
              aria-label="Previous Popular"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollContainer(popularRef, 'right')}
              className="p-2.5 rounded-sm bg-white/5 border border-white/15 hover:border-white hover:bg-white hover:text-black text-white transition"
              aria-label="Next Popular"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          ref={popularRef}
          className="flex gap-4 sm:gap-5 overflow-x-auto scroll-smooth no-scrollbar pb-4 snap-x"
        >
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="w-48 sm:w-56 aspect-[3/4] rounded-sm bg-white/5 animate-pulse shrink-0 border border-white/10"
                />
              ))
            : feed?.popular.map((anime, idx) => (
                <div key={anime.id} className="w-48 sm:w-56 shrink-0 snap-start">
                  <AnimeCard
                    anime={anime}
                    index={idx}
                    onClick={() => onSelectAnime(anime.id)}
                  />
                </div>
              ))}
        </div>
      </section>

      {/* Genres Hub Quick Explorer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 border-t border-white/10">
        <div className="p-6 sm:p-10 rounded-sm border border-white/10 bg-[#111111] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#FF3E00]">
                06 / TAXONOMY
              </span>
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white font-display">
                Explore By Genre
              </h3>
            </div>
            <button
              onClick={() => onNavigate('browse')}
              className="text-xs uppercase tracking-[0.2em] font-bold text-white hover:text-[#FF3E00] transition-colors"
            >
              View Full Collection →
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {GENRES_LIST.map((genre) => (
              <button
                key={genre}
                onClick={() => onNavigate('browse', { genre })}
                className="px-4 py-2.5 rounded-sm bg-white/5 hover:bg-white hover:text-black border border-white/10 hover:border-white text-xs font-mono font-bold text-white/80 uppercase tracking-wider transition-all"
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
