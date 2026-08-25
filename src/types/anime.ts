export interface AnimeTitle {
  romaji?: string;
  english?: string;
  native?: string;
}

export interface AnimeCoverImage {
  extraLarge?: string;
  large: string;
  medium: string;
  color?: string;
}

export interface AnimeDate {
  year?: number;
  month?: number;
  day?: number;
}

export interface StudioNode {
  name: string;
}

export interface TrailerInfo {
  id?: string;
  site?: string;
}

export interface RelationEdge {
  relationType: string;
  node: {
    id: number;
    title: AnimeTitle;
    coverImage: AnimeCoverImage;
    format?: string;
    averageScore?: number;
    status?: string;
  };
}

export interface CharacterEdge {
  role: string;
  node: {
    id: number;
    name: {
      full: string;
      native?: string;
    };
    image: {
      large: string;
    };
  };
  voiceActors?: Array<{
    id: number;
    name: {
      full: string;
    };
    image?: {
      medium: string;
    };
    language?: string;
  }>;
}

export interface RecommendationNode {
  mediaRecommendation?: {
    id: number;
    title: AnimeTitle;
    coverImage: AnimeCoverImage;
    averageScore?: number;
    format?: string;
  };
}

export interface NextAiringEpisode {
  airingAt: number;
  timeUntilAiring: number;
  episode: number;
}

export interface AnimeMedia {
  id: number;
  title: AnimeTitle;
  coverImage: AnimeCoverImage;
  bannerImage?: string;
  description?: string;
  episodes?: number;
  duration?: number;
  status?: string;
  season?: string;
  seasonYear?: number;
  averageScore?: number;
  popularity?: number;
  favourites?: number;
  genres: string[];
  format?: string;
  source?: string;
  studios?: {
    nodes: StudioNode[];
  };
  trailer?: TrailerInfo;
  relations?: {
    edges: RelationEdge[];
  };
  characters?: {
    edges: CharacterEdge[];
  };
  recommendations?: {
    nodes: RecommendationNode[];
  };
  siteUrl?: string;
  nextAiringEpisode?: NextAiringEpisode;
  startDate?: AnimeDate;
}

export interface CharacterDetail {
  id: number;
  name: {
    full: string;
    native?: string;
    alternative?: string[];
  };
  image: {
    large: string;
  };
  description?: string;
  age?: string;
  gender?: string;
  bloodType?: string;
  dateOfBirth?: AnimeDate;
  siteUrl?: string;
}

export interface AiringScheduleItem {
  id: number;
  airingAt: number;
  episode: number;
  media: {
    id: number;
    title: AnimeTitle;
    coverImage: AnimeCoverImage;
    format?: string;
    averageScore?: number;
    genres?: string[];
    isAdult?: boolean;
    bannerImage?: string;
  };
}

export type WatchStatus = 'watching' | 'plan' | 'completed' | 'dropped';

export interface WatchlistItem {
  id: number;
  title: string;
  nativeTitle?: string;
  coverImage: string;
  format?: string;
  totalEpisodes?: number;
  watchedEpisodes: number;
  status: WatchStatus;
  userScore?: number;
  notes?: string;
  updatedAt: number;
  genres?: string[];
}

export interface BrowseFilters {
  page: number;
  search: string;
  genre: string;
  format: string;
  status: string;
  sort: string;
  minScore: string;
  year: string;
  season?: string;
}

export interface SurpriseSettings {
  genre: string;
  format: string;
  minScore: string;
  year: string;
}
