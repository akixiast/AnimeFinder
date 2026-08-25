import { WatchlistItem, WatchStatus, AnimeMedia, SurpriseSettings } from '../types/anime';

const WATCHLIST_KEY = 'animefinder_watchlist_v1';
const SURPRISE_KEY = 'animefinder_surprise_v1';
const RECENT_VIEWED_KEY = 'animefinder_recent_views_v1';

export function getWatchlist(): WatchlistItem[] {
  try {
    const raw = localStorage.getItem(WATCHLIST_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as WatchlistItem[];
  } catch (e) {
    console.error('Error loading watchlist from storage:', e);
    return [];
  }
}

export function saveWatchlist(items: WatchlistItem[]): void {
  try {
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('watchlist_updated'));
  } catch (e) {
    console.error('Error saving watchlist to storage:', e);
  }
}

export function updateWatchlistItem(
  anime: AnimeMedia | { id: number; title?: any; coverImage?: any; format?: string; episodes?: number; genres?: string[] },
  status: WatchStatus,
  options?: { watchedEpisodes?: number; userScore?: number; notes?: string }
): WatchlistItem[] {
  const currentList = getWatchlist();
  const existingIndex = currentList.findIndex((i) => i.id === anime.id);

  const titleStr =
    typeof anime.title === 'string'
      ? anime.title
      : anime.title?.english || anime.title?.romaji || anime.title?.native || 'Unknown Title';

  const coverStr =
    typeof anime.coverImage === 'string'
      ? anime.coverImage
      : anime.coverImage?.extraLarge || anime.coverImage?.large || anime.coverImage?.medium || '';

  const item: WatchlistItem = {
    id: anime.id,
    title: titleStr,
    nativeTitle: typeof anime.title === 'object' ? anime.title?.native : undefined,
    coverImage: coverStr,
    format: anime.format || 'TV',
    totalEpisodes: anime.episodes,
    watchedEpisodes:
      options?.watchedEpisodes ?? (existingIndex >= 0 ? currentList[existingIndex].watchedEpisodes : 0),
    status,
    userScore: options?.userScore ?? (existingIndex >= 0 ? currentList[existingIndex].userScore : undefined),
    notes: options?.notes ?? (existingIndex >= 0 ? currentList[existingIndex].notes : undefined),
    updatedAt: Date.now(),
    genres: anime.genres || [],
  };

  let newList: WatchlistItem[];
  if (existingIndex >= 0) {
    newList = [...currentList];
    newList[existingIndex] = item;
  } else {
    newList = [item, ...currentList];
  }

  saveWatchlist(newList);
  return newList;
}

export function removeWatchlistItem(animeId: number): WatchlistItem[] {
  const currentList = getWatchlist();
  const filtered = currentList.filter((i) => i.id !== animeId);
  saveWatchlist(filtered);
  return filtered;
}

export function getWatchlistStatus(animeId: number): WatchStatus | null {
  const list = getWatchlist();
  const found = list.find((i) => i.id === animeId);
  return found ? found.status : null;
}

export function getSurpriseSettings(): SurpriseSettings {
  try {
    const raw = localStorage.getItem(SURPRISE_KEY);
    if (!raw) {
      return {
        genre: '',
        format: '',
        minScore: '75',
        year: '',
      };
    }
    return JSON.parse(raw);
  } catch {
    return {
      genre: '',
      format: '',
      minScore: '75',
      year: '',
    };
  }
}

export function saveSurpriseSettings(settings: SurpriseSettings): void {
  try {
    localStorage.setItem(SURPRISE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving surprise settings:', e);
  }
}

export function recordRecentView(anime: AnimeMedia): void {
  try {
    const raw = localStorage.getItem(RECENT_VIEWED_KEY);
    let list: { id: number; title: string; image: string; score?: number }[] = raw ? JSON.parse(raw) : [];
    list = list.filter((i) => i.id !== anime.id);
    list.unshift({
      id: anime.id,
      title: anime.title.english || anime.title.romaji || 'Unknown Title',
      image: anime.coverImage.large || anime.coverImage.medium,
      score: anime.averageScore,
    });
    if (list.length > 10) list = list.slice(0, 10);
    localStorage.setItem(RECENT_VIEWED_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Error recording recent view:', e);
  }
}

export function getRecentViews(): { id: number; title: string; image: string; score?: number }[] {
  try {
    const raw = localStorage.getItem(RECENT_VIEWED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
