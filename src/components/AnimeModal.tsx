import React, { useState, useEffect } from 'react';
import {
  X,
  Star,
  Tv,
  Calendar,
  ExternalLink,
  Users,
  Film,
  Building,
  Sparkles,
  Share2,
  Clock,
  Play,
  Check,
  Plus,
  Minus,
  MessageSquare,
  Bookmark,
} from 'lucide-react';
import { AnimeMedia, CharacterEdge, WatchStatus } from '../types/anime';
import { fetchAnimeDetails } from '../services/anilist';
import {
  getWatchlist,
  updateWatchlistItem,
  removeWatchlistItem,
  recordRecentView,
} from '../services/storage';

interface AnimeModalProps {
  animeId: number | null;
  onClose: () => void;
  onSelectAnime: (id: number) => void;
  onSelectCharacter: (charId: number) => void;
}

export const AnimeModal: React.FC<AnimeModalProps> = ({
  animeId,
  onClose,
  onSelectAnime,
  onSelectCharacter,
}) => {
  const [anime, setAnime] = useState<AnimeMedia | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Watchlist state inside modal
  const [watchStatus, setWatchStatus] = useState<WatchStatus | null>(null);
  const [watchedEps, setWatchedEps] = useState(0);
  const [userScore, setUserScore] = useState<number | undefined>(undefined);
  const [userNotes, setUserNotes] = useState('');
  const [showNotesInput, setShowNotesInput] = useState(false);

  useEffect(() => {
    if (!animeId) return;

    let isMounted = true;
    setLoading(true);

    fetchAnimeDetails(animeId).then((data) => {
      if (!isMounted) return;
      setAnime(data);
      setLoading(false);

      if (data) {
        recordRecentView(data);
        // Load watchlist state
        const list = getWatchlist();
        const existing = list.find((i) => i.id === data.id);
        if (existing) {
          setWatchStatus(existing.status);
          setWatchedEps(existing.watchedEpisodes || 0);
          setUserScore(existing.userScore);
          setUserNotes(existing.notes || '');
        } else {
          setWatchStatus(null);
          setWatchedEps(0);
          setUserScore(undefined);
          setUserNotes('');
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [animeId]);

  if (!animeId) return null;

  const handleStatusSelect = (status: WatchStatus) => {
    if (!anime) return;
    if (watchStatus === status) {
      removeWatchlistItem(anime.id);
      setWatchStatus(null);
    } else {
      updateWatchlistItem(anime, status, {
        watchedEpisodes: watchedEps,
        userScore,
        notes: userNotes,
      });
      setWatchStatus(status);
    }
  };

  const handleEpisodeChange = (delta: number) => {
    if (!anime) return;
    const maxEps = anime.episodes || 999;
    const newEps = Math.max(0, Math.min(maxEps, watchedEps + delta));
    setWatchedEps(newEps);
    if (watchStatus) {
      updateWatchlistItem(anime, watchStatus, {
        watchedEpisodes: newEps,
        userScore,
        notes: userNotes,
      });
    }
  };

  const handleScoreChange = (score: number) => {
    if (!anime) return;
    const newScore = userScore === score ? undefined : score;
    setUserScore(newScore);
    if (watchStatus) {
      updateWatchlistItem(anime, watchStatus, {
        watchedEpisodes: watchedEps,
        userScore: newScore,
        notes: userNotes,
      });
    }
  };

  const handleSaveNotes = () => {
    if (!anime || !watchStatus) return;
    updateWatchlistItem(anime, watchStatus, {
      watchedEpisodes: watchedEps,
      userScore,
      notes: userNotes,
    });
    setShowNotesInput(false);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const cleanDescription = (desc?: string) => {
    if (!desc) return 'No description available for this anime.';
    return desc.replace(/<br\s*[\/]?>/gi, '\n').replace(/<\/?[^>]+(>|$)/g, '');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-5xl bg-[#0a0a0a] border border-white/20 rounded-sm shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-150">
        {/* Floating Close Button */}
        <button
          id="btn-close-anime-modal"
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2.5 bg-black hover:bg-[#FF3E00] text-white border border-white/20 transition-all cursor-pointer"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center min-h-[50vh] gap-4">
            <div className="w-10 h-10 border-2 border-white/20 border-t-[#FF3E00] rounded-full animate-spin" />
            <p className="text-white/50 font-mono text-xs uppercase tracking-widest animate-pulse">FETCHING ANIME RECORD...</p>
          </div>
        ) : !anime ? (
          <div className="p-12 text-center text-rose-400">
            <p className="text-lg font-black uppercase font-display">Failed to load anime details.</p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-white text-black font-bold text-xs uppercase font-mono rounded-sm"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="overflow-y-auto">
            {/* Hero Header Banner */}
            <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-black">
              <img
                src={
                  anime.bannerImage ||
                  anime.coverImage?.extraLarge ||
                  anime.coverImage?.large
                }
                alt={anime.title.english || anime.title.romaji}
                className="w-full h-full object-cover object-center filter brightness-50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent" />

              {/* Header Title Information */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 flex items-end gap-6">
                {/* Poster on larger screens */}
                <div className="hidden sm:block w-40 shrink-0 aspect-[3/4] rounded-sm overflow-hidden shadow-2xl border-2 border-white/20 -mb-16 z-20 bg-black">
                  <img
                    src={anime.coverImage.extraLarge || anime.coverImage.large}
                    alt={anime.title.english || anime.title.romaji}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2 font-mono text-[10px] uppercase">
                    <span className="px-2 py-0.5 font-bold bg-[#FF3E00] text-white">
                      {anime.format || 'TV'}
                    </span>
                    {anime.seasonYear && (
                      <span className="px-2 py-0.5 font-bold bg-black text-white/80 border border-white/20">
                        {anime.season ? `${anime.season} ` : ''}
                        {anime.seasonYear}
                      </span>
                    )}
                    {anime.status && (
                      <span className="px-2 py-0.5 font-bold bg-black text-white/80 border border-white/20">
                        {anime.status.replace(/_/g, ' ')}
                      </span>
                    )}
                  </div>

                  <h1 className="text-2xl sm:text-4xl font-black uppercase text-white leading-tight font-display">
                    {anime.title.english || anime.title.romaji}
                  </h1>
                  {anime.title.native && (
                    <p className="text-white/40 text-xs mt-1 font-mono uppercase">
                      {anime.title.native} // {anime.title.romaji}
                    </p>
                  )}

                  {/* Genre tags */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {anime.genres.map((g) => (
                      <span
                        key={g}
                        className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-black text-white/70 border border-white/15"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Body: Left Sidebar + Right Main Content */}
            <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Actions, Watchlist tracker, Stats */}
              <div className="lg:col-span-1 space-y-6">
                {/* Mobile Poster if on phone */}
                <div className="sm:hidden w-36 mx-auto aspect-[3/4] rounded-sm overflow-hidden border border-white/20">
                  <img
                    src={anime.coverImage.extraLarge || anime.coverImage.large}
                    alt={anime.title.english || anime.title.romaji}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Watchlist Manager Panel */}
                <div className="p-5 rounded-sm bg-[#111111] border border-white/10 space-y-4">
                  <h3 className="text-[10px] font-mono font-bold text-white/60 uppercase tracking-widest flex items-center gap-1.5">
                    <Bookmark className="w-3.5 h-3.5 text-[#FF3E00]" /> WATCHLIST & TRACKING
                  </h3>

                  {/* Status Buttons */}
                  <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px] uppercase">
                    <button
                      onClick={() => handleStatusSelect('watching')}
                      className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-none font-bold transition-all cursor-pointer ${
                        watchStatus === 'watching'
                          ? 'bg-[#FF3E00] text-white'
                          : 'bg-black hover:bg-white/10 text-white/70 border border-white/15'
                      }`}
                    >
                      <Play className="w-3 h-3" /> Watching
                    </button>

                    <button
                      onClick={() => handleStatusSelect('plan')}
                      className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-none font-bold transition-all cursor-pointer ${
                        watchStatus === 'plan'
                          ? 'bg-white text-black'
                          : 'bg-black hover:bg-white/10 text-white/70 border border-white/15'
                      }`}
                    >
                      <Clock className="w-3 h-3" /> Plan to Watch
                    </button>

                    <button
                      onClick={() => handleStatusSelect('completed')}
                      className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-none font-bold transition-all cursor-pointer ${
                        watchStatus === 'completed'
                          ? 'bg-white text-black'
                          : 'bg-black hover:bg-white/10 text-white/70 border border-white/15'
                      }`}
                    >
                      <Check className="w-3 h-3" /> Completed
                    </button>

                    <button
                      onClick={() => handleStatusSelect('dropped')}
                      className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-none font-bold transition-all cursor-pointer ${
                        watchStatus === 'dropped'
                          ? 'bg-[#FF3E00] text-white'
                          : 'bg-black hover:bg-white/10 text-white/70 border border-white/15'
                      }`}
                    >
                      <X className="w-3 h-3" /> Dropped
                    </button>
                  </div>

                  {/* Episode Progress Counter */}
                  {watchStatus && (
                    <div className="pt-3 border-t border-white/10 space-y-2 font-mono">
                      <div className="flex items-center justify-between text-xs text-white/70">
                        <span className="text-[10px] uppercase text-white/40">PROGRESS:</span>
                        <span className="text-white font-bold">
                          {watchedEps} / {anime.episodes || '∞'} EPS
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEpisodeChange(-1)}
                          disabled={watchedEps <= 0}
                          className="p-1 rounded-sm bg-black border border-white/20 hover:bg-white hover:text-black disabled:opacity-20 text-white cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <div className="flex-1 bg-black border border-white/20 overflow-hidden h-1.5">
                          <div
                            className="bg-[#FF3E00] h-full transition-all duration-200"
                            style={{
                              width: `${
                                anime.episodes
                                  ? Math.min(100, (watchedEps / anime.episodes) * 100)
                                  : 50
                              }%`,
                            }}
                          />
                        </div>
                        <button
                          onClick={() => handleEpisodeChange(1)}
                          disabled={anime.episodes ? watchedEps >= anime.episodes : false}
                          className="p-1 rounded-sm bg-black border border-white/20 hover:bg-white hover:text-black disabled:opacity-20 text-white cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* User Score Rating */}
                      <div className="pt-2">
                        <div className="text-[10px] uppercase text-white/50 mb-1">
                          SCORE: {userScore ? `${userScore} / 10` : 'UNRATED'}
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                            <button
                              key={star}
                              onClick={() => handleScoreChange(star)}
                              className={`p-1 text-xs transition-all cursor-pointer ${
                                userScore && userScore >= star
                                  ? 'text-[#FF3E00] font-bold'
                                  : 'text-white/20 hover:text-white'
                              }`}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Notes toggle */}
                      <div className="pt-2">
                        {showNotesInput ? (
                          <div className="space-y-2">
                            <textarea
                              rows={2}
                              value={userNotes}
                              onChange={(e) => setUserNotes(e.target.value)}
                              placeholder="Personal notes..."
                              className="w-full p-2 bg-black border border-white/20 rounded-sm text-xs text-white placeholder-white/40 focus:outline-none focus:border-white font-mono"
                            />
                            <div className="flex justify-end gap-2 text-xs">
                              <button
                                onClick={() => setShowNotesInput(false)}
                                className="px-2 py-1 text-white/50 hover:text-white"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handleSaveNotes}
                                className="px-3 py-1 bg-white text-black font-bold uppercase"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowNotesInput(true)}
                            className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white font-mono uppercase"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-[#FF3E00]" />
                            {userNotes ? 'EDIT NOTES' : '+ ADD NOTE'}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Score & Popularity Highlights */}
                <div className="grid grid-cols-2 gap-2 text-center font-mono">
                  <div className="p-3 bg-[#111111] border border-white/10 rounded-sm">
                    <div className="text-xl font-bold text-white flex items-center justify-center gap-1">
                      <span className="text-[#FF3E00]">★</span>
                      {anime.averageScore ? `${anime.averageScore}%` : 'N/A'}
                    </div>
                    <div className="text-[9px] uppercase tracking-widest text-white/40 mt-0.5">
                      SCORE
                    </div>
                  </div>

                  <div className="p-3 bg-[#111111] border border-white/10 rounded-sm">
                    <div className="text-xl font-bold text-white flex items-center justify-center gap-1">
                      {anime.popularity ? `#${anime.popularity.toLocaleString()}` : '-'}
                    </div>
                    <div className="text-[9px] uppercase tracking-widest text-white/40 mt-0.5">
                      POPULARITY
                    </div>
                  </div>
                </div>

                {/* Metadata List */}
                <div className="p-4 rounded-sm bg-[#111111] border border-white/10 divide-y divide-white/10 text-xs font-mono">
                  <div className="flex justify-between py-2">
                    <span className="text-white/40 uppercase">EPISODES</span>
                    <span className="font-bold text-white">
                      {anime.episodes || 'ONGOING / TBA'}
                    </span>
                  </div>

                  <div className="flex justify-between py-2">
                    <span className="text-white/40 uppercase">DURATION</span>
                    <span className="font-bold text-white">
                      {anime.duration ? `${anime.duration} MINS/EP` : 'N/A'}
                    </span>
                  </div>

                  <div className="flex justify-between py-2">
                    <span className="text-white/40 uppercase">STUDIO</span>
                    <span className="font-bold text-white truncate max-w-[140px]">
                      {anime.studios?.nodes?.map((s) => s.name).join(', ') || 'UNKNOWN'}
                    </span>
                  </div>

                  <div className="flex justify-between py-2">
                    <span className="text-white/40 uppercase">SOURCE</span>
                    <span className="font-bold text-white uppercase">
                      {anime.source ? anime.source.replace(/_/g, ' ') : 'ORIGINAL'}
                    </span>
                  </div>
                </div>

                {/* External Actions */}
                <div className="flex gap-2">
                  {anime.siteUrl && (
                    <a
                      href={anime.siteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-black hover:bg-white text-white hover:text-black rounded-sm text-xs font-mono font-bold uppercase border border-white/20 transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#FF3E00]" /> AniList Page
                    </a>
                  )}

                  <button
                    onClick={handleShare}
                    className="p-2.5 bg-black hover:bg-white text-white hover:text-black rounded-sm border border-white/20 transition cursor-pointer"
                    title="Copy Link"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
                {copied && (
                  <p className="text-center text-xs text-[#FF3E00] font-mono uppercase tracking-wider animate-pulse">
                    LINK COPIED TO CLIPBOARD
                  </p>
                )}
              </div>

              {/* Right Column: Synopsis, Trailer, Characters, Relations, Recommendations */}
              <div className="lg:col-span-2 space-y-8">
                {/* Synopsis */}
                <div>
                  <h3 className="text-sm font-black uppercase text-white mb-2 tracking-wider font-display flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#FF3E00]" />
                    Synopsis
                  </h3>
                  <div className="p-4 rounded-sm bg-[#111111] border border-white/10 text-white/70 text-xs sm:text-sm leading-relaxed whitespace-pre-line max-h-56 overflow-y-auto font-sans">
                    {cleanDescription(anime.description)}
                  </div>
                </div>

                {/* YouTube Trailer */}
                {anime.trailer?.site === 'youtube' && anime.trailer?.id && (
                  <div>
                    <h3 className="text-sm font-black uppercase text-white mb-2 tracking-wider font-display flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#FF3E00]" />
                      Official Trailer
                    </h3>
                    <div className="aspect-video w-full rounded-sm overflow-hidden border border-white/10 bg-black">
                      <iframe
                        src={`https://www.youtube.com/embed/${anime.trailer.id}`}
                        title="Anime Trailer"
                        className="w-full h-full"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                    </div>
                  </div>
                )}

                {/* Characters & Voice Cast */}
                {anime.characters?.edges && anime.characters.edges.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-black uppercase text-white tracking-wider font-display flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-[#FF3E00]" />
                        Main Cast & Characters
                      </h3>
                      <span className="text-[10px] font-mono uppercase text-white/40">CLICK FOR BIO</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {anime.characters.edges.slice(0, 8).map((edge: CharacterEdge) => {
                        const voiceActor = edge.voiceActors?.[0];
                        return (
                          <div
                            key={edge.node.id}
                            onClick={() => onSelectCharacter(edge.node.id)}
                            className="group flex flex-col p-2 rounded-sm bg-[#111111] hover:bg-black border border-white/10 hover:border-white/40 cursor-pointer transition-all"
                          >
                            <div className="aspect-square w-full rounded-none overflow-hidden bg-black mb-2 border border-white/10">
                              <img
                                src={edge.node.image.large}
                                alt={edge.node.name.full}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold uppercase text-white truncate group-hover:text-[#FF3E00] transition-colors font-display">
                                {edge.node.name.full}
                              </h4>
                              <p className="text-[10px] font-mono text-white/40 truncate uppercase">
                                {edge.role.toLowerCase()}
                              </p>
                              {voiceActor && (
                                <p className="text-[9px] font-mono text-white/50 truncate mt-0.5 uppercase">
                                  VA: {voiceActor.name.full}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Franchise Prequels / Sequels */}
                {anime.relations?.edges && anime.relations.edges.length > 0 && (
                  <div>
                    <h3 className="text-sm font-black uppercase text-white mb-3 tracking-wider font-display flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#FF3E00]" />
                      Franchise & Related
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {anime.relations.edges.slice(0, 4).map((edge) => (
                        <div
                          key={edge.node.id}
                          onClick={() => onSelectAnime(edge.node.id)}
                          className="group relative flex gap-2 p-2 rounded-sm bg-[#111111] hover:bg-black border border-white/10 hover:border-white/40 cursor-pointer transition-all"
                        >
                          <img
                            src={edge.node.coverImage.medium || edge.node.coverImage.large}
                            alt={edge.node.title.english || edge.node.title.romaji}
                            className="w-10 h-14 object-cover rounded-none shrink-0 bg-black border border-white/10"
                          />
                          <div className="min-w-0 flex-1 flex flex-col justify-center">
                            <span className="text-[9px] font-mono font-bold uppercase text-[#FF3E00]">
                              {edge.relationType.replace(/_/g, ' ')}
                            </span>
                            <h5 className="text-xs font-bold uppercase text-white truncate group-hover:text-[#FF3E00] mt-0.5 font-display">
                              {edge.node.title.english || edge.node.title.romaji}
                            </h5>
                            <span className="text-[9px] font-mono text-white/40 mt-0.5 uppercase">
                              {edge.node.format || 'TV'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {anime.recommendations?.nodes && anime.recommendations.nodes.length > 0 && (
                  <div>
                    <h3 className="text-sm font-black uppercase text-white mb-3 tracking-wider font-display flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#FF3E00]" />
                      You Might Also Like
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {anime.recommendations.nodes
                        .filter((r) => r.mediaRecommendation)
                        .slice(0, 4)
                        .map((rec) => {
                          const rAnime = rec.mediaRecommendation!;
                          return (
                            <div
                              key={rAnime.id}
                              onClick={() => onSelectAnime(rAnime.id)}
                              className="group flex flex-col rounded-sm overflow-hidden bg-[#111111] hover:bg-black border border-white/10 hover:border-white/40 cursor-pointer transition-all"
                            >
                              <div className="aspect-[3/4] w-full overflow-hidden bg-black">
                                <img
                                  src={rAnime.coverImage.large || rAnime.coverImage.medium}
                                  alt={rAnime.title.english || rAnime.title.romaji}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                              <div className="p-2">
                                <h5 className="text-xs font-bold uppercase text-white truncate group-hover:text-[#FF3E00] font-display">
                                  {rAnime.title.english || rAnime.title.romaji}
                                </h5>
                                {rAnime.averageScore && (
                                  <span className="text-[10px] font-mono text-white/70 flex items-center gap-1 mt-0.5">
                                    <span className="text-[#FF3E00]">★</span> {rAnime.averageScore}%
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
