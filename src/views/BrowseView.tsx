import React, { useState, useEffect } from 'react';
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Filter,
} from 'lucide-react';
import { AnimeMedia, BrowseFilters } from '../types/anime';
import { browseAnime, GENRES_LIST } from '../services/anilist';
import { AnimeCard } from '../components/AnimeCard';

interface BrowseViewProps {
  onSelectAnime: (id: number) => void;
  initialFilters?: Partial<BrowseFilters>;
}

export const BrowseView: React.FC<BrowseViewProps> = ({
  onSelectAnime,
  initialFilters,
}) => {
  const [filters, setFilters] = useState<BrowseFilters>({
    page: 1,
    search: initialFilters?.search || '',
    genre: initialFilters?.genre || '',
    format: initialFilters?.format || '',
    status: initialFilters?.status || '',
    sort: initialFilters?.sort || 'POPULARITY_DESC',
    minScore: initialFilters?.minScore || '',
    year: initialFilters?.year || '',
    season: initialFilters?.season || '',
  });

  const [mediaList, setMediaList] = useState<AnimeMedia[]>([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  // Search input state with debounce
  const [searchInput, setSearchInput] = useState(filters.search);

  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput, page: 1 }));
    }, 400);
    return () => clearTimeout(handler);
  }, [searchInput]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    browseAnime(filters).then((result) => {
      if (!isMounted) return;
      if (result) {
        setMediaList(result.media);
        setHasNextPage(result.pageInfo.hasNextPage);
      } else {
        setMediaList([]);
        setHasNextPage(false);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [filters]);

  const handleFilterChange = (key: keyof BrowseFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to page 1 on filter change
    }));
  };

  const clearAllFilters = () => {
    setSearchInput('');
    setFilters({
      page: 1,
      search: '',
      genre: '',
      format: '',
      status: '',
      sort: 'POPULARITY_DESC',
      minScore: '',
      year: '',
      season: '',
    });
  };

  const handlePageChange = (delta: number) => {
    const newPage = Math.max(1, filters.page + delta);
    setFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeFiltersCount = [
    filters.genre,
    filters.format,
    filters.status,
    filters.minScore,
    filters.year,
    filters.season,
  ].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 pb-16 animate-in fade-in duration-300">
      {/* View Title */}
      <div className="border-b border-white/10 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#FF3E00]">
            02 / ADVANCED ARCHIVE
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-display mt-1">
            Browse All Anime
          </h1>
        </div>
        <div className="text-[11px] font-mono uppercase tracking-widest text-white/50">
          INDEXING 10,000+ TITLES
        </div>
      </div>

      {/* Top Search & Filter Bar */}
      <div className="bg-[#111111] p-4 sm:p-5 rounded-sm border border-white/10 sticky top-24 z-30 space-y-4 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Main Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#FF3E00] absolute left-4 top-3.5" />
            <input
              id="browse-search-input"
              type="text"
              placeholder="SEARCH TITLE, STUDIO, OR KEYWORD..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-11 pr-10 py-3 rounded-sm bg-black border border-white/20 text-xs sm:text-sm text-white uppercase placeholder-white/40 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all font-mono"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute right-3 top-3 p-1 text-white/50 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFiltersPanel(!showFiltersPanel)}
            className={`flex items-center gap-2 px-5 py-3 rounded-sm font-bold text-xs uppercase tracking-widest border transition-all shrink-0 cursor-pointer ${
              showFiltersPanel || activeFiltersCount > 0
                ? 'bg-white text-black border-white'
                : 'bg-black hover:bg-white/10 text-white border-white/20'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>FILTERS</span>
            {activeFiltersCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] bg-[#FF3E00] text-white font-mono font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Expandable Advanced Filters Panel */}
        {showFiltersPanel && (
          <div className="pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 animate-in slide-in-from-top-2 duration-150">
            {/* Genre */}
            <div>
              <label className="block text-[10px] font-mono font-bold text-white/50 uppercase tracking-widest mb-1.5">
                [01] GENRE
              </label>
              <select
                value={filters.genre}
                onChange={(e) => handleFilterChange('genre', e.target.value)}
                className="w-full bg-black border border-white/20 rounded-sm p-2 text-xs text-white uppercase font-mono focus:outline-none focus:border-white"
              >
                <option value="">ALL GENRES</option>
                {GENRES_LIST.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {/* Format */}
            <div>
              <label className="block text-[10px] font-mono font-bold text-white/50 uppercase tracking-widest mb-1.5">
                [02] FORMAT
              </label>
              <select
                value={filters.format}
                onChange={(e) => handleFilterChange('format', e.target.value)}
                className="w-full bg-black border border-white/20 rounded-sm p-2 text-xs text-white uppercase font-mono focus:outline-none focus:border-white"
              >
                <option value="">ALL FORMATS</option>
                <option value="TV">TV SERIES</option>
                <option value="MOVIE">MOVIE</option>
                <option value="OVA">OVA</option>
                <option value="ONA">ONA (WEB)</option>
                <option value="SPECIAL">SPECIAL</option>
              </select>
            </div>

            {/* Airing Status */}
            <div>
              <label className="block text-[10px] font-mono font-bold text-white/50 uppercase tracking-widest mb-1.5">
                [03] STATUS
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full bg-black border border-white/20 rounded-sm p-2 text-xs text-white uppercase font-mono focus:outline-none focus:border-white"
              >
                <option value="">ALL STATUSES</option>
                <option value="RELEASING">AIRING NOW</option>
                <option value="FINISHED">FINISHED</option>
                <option value="NOT_YET_RELEASED">UPCOMING</option>
              </select>
            </div>

            {/* Min Score */}
            <div>
              <label className="block text-[10px] font-mono font-bold text-white/50 uppercase tracking-widest mb-1.5">
                [04] MIN SCORE
              </label>
              <select
                value={filters.minScore}
                onChange={(e) => handleFilterChange('minScore', e.target.value)}
                className="w-full bg-black border border-white/20 rounded-sm p-2 text-xs text-white uppercase font-mono focus:outline-none focus:border-white"
              >
                <option value="">ANY SCORE</option>
                <option value="85">85%+ (MASTERPIECE)</option>
                <option value="80">80%+ (GREAT)</option>
                <option value="75">75%+ (GOOD)</option>
                <option value="70">70%+ (DECENT)</option>
              </select>
            </div>

            {/* Year */}
            <div>
              <label className="block text-[10px] font-mono font-bold text-white/50 uppercase tracking-widest mb-1.5">
                [05] YEAR
              </label>
              <input
                type="number"
                placeholder="YYYY"
                min="1970"
                max="2027"
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="w-full bg-black border border-white/20 rounded-sm p-2 text-xs text-white uppercase font-mono focus:outline-none focus:border-white"
              />
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-[10px] font-mono font-bold text-white/50 uppercase tracking-widest mb-1.5">
                [06] SORT BY
              </label>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="w-full bg-black border border-white/20 rounded-sm p-2 text-xs text-white uppercase font-mono focus:outline-none focus:border-white"
              >
                <option value="POPULARITY_DESC">POPULARITY</option>
                <option value="SCORE_DESC">HIGHEST RATED</option>
                <option value="TRENDING_DESC">TRENDING</option>
                <option value="START_DATE_DESC">NEWEST RELEASE</option>
                <option value="FAVOURITES_DESC">MOST FAVORITED</option>
              </select>
            </div>

            {/* Clear Filters button */}
            {activeFiltersCount > 0 && (
              <div className="col-span-full flex justify-end pt-2 border-t border-white/10">
                <button
                  onClick={clearAllFilters}
                  className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-mono font-bold uppercase tracking-wider"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> RESET ALL FILTERS
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-1">
        <div className="text-xs font-mono uppercase tracking-wider text-white/60">
          {loading ? (
            <span>QUERYING DATABASE...</span>
          ) : (
            <span>
              PAGE {filters.page} {filters.search ? `// RESULTS FOR "${filters.search.toUpperCase()}"` : ''}
            </span>
          )}
        </div>

        {/* Quick Sorting Pills */}
        <div className="hidden sm:flex items-center gap-1 bg-black p-1 rounded-sm border border-white/15 text-[11px] font-mono uppercase">
          {[
            { id: 'POPULARITY_DESC', label: 'POPULAR' },
            { id: 'SCORE_DESC', label: 'TOP RATED' },
            { id: 'TRENDING_DESC', label: 'TRENDING' },
            { id: 'START_DATE_DESC', label: 'NEWEST' },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => handleFilterChange('sort', s.id)}
              className={`px-2.5 py-1 font-bold transition-all rounded-none ${
                filters.sort === s.id
                  ? 'bg-[#FF3E00] text-white'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Cards */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] rounded-sm bg-white/5 animate-pulse border border-white/10"
            />
          ))}
        </div>
      ) : mediaList.length === 0 ? (
        <div className="p-16 text-center bg-[#111111] rounded-sm border border-white/10 max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-sm bg-black border border-white/20 text-white/40 flex items-center justify-center mx-auto text-xl">
            ∅
          </div>
          <h3 className="text-xl font-black uppercase text-white font-display">No Results Found</h3>
          <p className="text-xs uppercase font-mono tracking-wider text-white/50">
            No entries matched your specified query and parameter constraints.
          </p>
          <button
            onClick={clearAllFilters}
            className="px-6 py-3 bg-white hover:bg-[#FF3E00] text-black hover:text-white font-black text-xs uppercase tracking-widest transition-all rounded-sm"
          >
            RESET ALL FILTERS
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {mediaList.map((anime, idx) => (
            <AnimeCard
              key={anime.id}
              anime={anime}
              index={idx}
              onClick={() => onSelectAnime(anime.id)}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center justify-center gap-3 pt-8 border-t border-white/10">
        <button
          onClick={() => handlePageChange(-1)}
          disabled={filters.page <= 1 || loading}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-sm bg-black border border-white/20 text-white font-bold text-xs uppercase tracking-wider hover:bg-white hover:text-black disabled:opacity-30 disabled:pointer-events-none transition"
        >
          <ChevronLeft className="w-4 h-4" /> PREV
        </button>

        <span className="px-4 py-2 bg-white/5 text-xs font-mono font-bold text-white border border-white/15">
          PAGE {filters.page}
        </span>

        <button
          onClick={() => handlePageChange(1)}
          disabled={!hasNextPage || loading}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-sm bg-black border border-white/20 text-white font-bold text-xs uppercase tracking-wider hover:bg-white hover:text-black disabled:opacity-30 disabled:pointer-events-none transition"
        >
          NEXT <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
