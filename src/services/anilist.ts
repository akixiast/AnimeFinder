import { AnimeMedia, AiringScheduleItem, CharacterDetail, BrowseFilters } from '../types/anime';

const ANILIST_API = 'https://graphql.anilist.co';

export const GENRES_LIST = [
  'Action',
  'Adventure',
  'Comedy',
  'Drama',
  'Ecchi',
  'Fantasy',
  'Horror',
  'Mahou Shoujo',
  'Mecha',
  'Music',
  'Mystery',
  'Psychological',
  'Romance',
  'Sci-Fi',
  'Slice of Life',
  'Sports',
  'Supernatural',
  'Thriller'
];

async function anilistQuery<T>(query: string, variables: Record<string, any> = {}): Promise<T | null> {
  try {
    const response = await fetch(ANILIST_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      console.error(`AniList HTTP error! Status: ${response.status}`);
      return null;
    }

    const json = await response.json();
    if (json.errors) {
      console.warn('AniList GraphQL errors:', json.errors);
    }
    return json.data as T;
  } catch (error) {
    console.error('AniList API fetch exception:', error);
    return null;
  }
}

export async function getHomeFeed(): Promise<{
  trending: AnimeMedia[];
  upcoming: AnimeMedia[];
  topRated: AnimeMedia[];
  popular: AnimeMedia[];
} | null> {
  const query = `
    query HomeFeed {
      Trending: Page(page: 1, perPage: 16) {
        media(type: ANIME, sort: TRENDING_DESC, isAdult: false) {
          id
          title { romaji english native }
          coverImage { extraLarge large medium color }
          bannerImage
          averageScore
          seasonYear
          season
          format
          genres
          episodes
          nextAiringEpisode { episode timeUntilAiring airingAt }
          startDate { year month day }
        }
      }
      Upcoming: Page(page: 1, perPage: 12) {
        media(type: ANIME, sort: POPULARITY_DESC, status: NOT_YET_RELEASED, isAdult: false) {
          id
          title { romaji english native }
          coverImage { extraLarge large medium color }
          bannerImage
          seasonYear
          format
          genres
          startDate { year month }
        }
      }
      TopRated: Page(page: 1, perPage: 12) {
        media(type: ANIME, sort: SCORE_DESC, isAdult: false, format_in: [TV, MOVIE]) {
          id
          title { romaji english native }
          coverImage { extraLarge large medium color }
          averageScore
          seasonYear
          format
          genres
          startDate { year month }
        }
      }
      Popular: Page(page: 1, perPage: 16) {
        media(type: ANIME, sort: POPULARITY_DESC, isAdult: false) {
          id
          title { romaji english native }
          coverImage { extraLarge large medium color }
          bannerImage
          averageScore
          seasonYear
          format
          genres
          episodes
          startDate { year }
        }
      }
    }
  `;

  const data = await anilistQuery<{
    Trending: { media: AnimeMedia[] };
    Upcoming: { media: AnimeMedia[] };
    TopRated: { media: AnimeMedia[] };
    Popular: { media: AnimeMedia[] };
  }>(query);

  if (!data) return null;

  return {
    trending: data.Trending?.media || [],
    upcoming: data.Upcoming?.media || [],
    topRated: data.TopRated?.media || [],
    popular: data.Popular?.media || [],
  };
}

export async function browseAnime(filters: BrowseFilters): Promise<{
  media: AnimeMedia[];
  pageInfo: { hasNextPage: boolean; currentPage: number; total?: number };
} | null> {
  const filterArgs: string[] = ['type: ANIME', 'isAdult: false'];

  if (filters.search && filters.search.trim()) {
    filterArgs.push(`search: ${JSON.stringify(filters.search.trim())}`);
  }
  if (filters.genre) {
    filterArgs.push(`genre_in: [${JSON.stringify(filters.genre)}]`);
  }
  if (filters.format) {
    filterArgs.push(`format: ${filters.format}`);
  }
  if (filters.status) {
    filterArgs.push(`status: ${filters.status}`);
  }
  if (filters.minScore) {
    filterArgs.push(`averageScore_greater: ${filters.minScore}`);
  }
  if (filters.year) {
    filterArgs.push(`seasonYear: ${filters.year}`);
  }
  if (filters.season) {
    filterArgs.push(`season: ${filters.season}`);
  }

  const sortArg = filters.sort || 'POPULARITY_DESC';

  const query = `
    query BrowseAnime($page: Int) {
      Page(page: $page, perPage: 20) {
        pageInfo {
          hasNextPage
          currentPage
          total
        }
        media(${filterArgs.join(', ')}, sort: ${sortArg}) {
          id
          title { romaji english native }
          coverImage { extraLarge large medium color }
          bannerImage
          averageScore
          seasonYear
          season
          format
          genres
          episodes
          status
          startDate { year month day }
        }
      }
    }
  `;

  const data = await anilistQuery<{
    Page: {
      pageInfo: { hasNextPage: boolean; currentPage: number; total?: number };
      media: AnimeMedia[];
    };
  }>(query, { page: filters.page });

  if (!data?.Page) return null;
  return {
    media: data.Page.media || [],
    pageInfo: data.Page.pageInfo || { hasNextPage: false, currentPage: 1 },
  };
}

export async function fetchAiringSchedule(startOfDayTimestamp: number): Promise<AiringScheduleItem[]> {
  const endOfDayTimestamp = startOfDayTimestamp + 86400;

  const query = `
    query AiringSchedule($start: Int, $end: Int) {
      Page(page: 1, perPage: 50) {
        airingSchedules(airingAt_greater: $start, airingAt_lesser: $end, sort: TIME) {
          id
          airingAt
          episode
          media {
            id
            title { romaji english native }
            coverImage { large medium extraLarge color }
            bannerImage
            format
            averageScore
            genres
            isAdult
          }
        }
      }
    }
  `;

  const data = await anilistQuery<{
    Page: {
      airingSchedules: AiringScheduleItem[];
    };
  }>(query, { start: startOfDayTimestamp, end: endOfDayTimestamp });

  if (!data?.Page?.airingSchedules) return [];
  // Filter out any adult anime safely
  return data.Page.airingSchedules.filter((s) => !s.media.isAdult);
}

export async function fetchAnimeDetails(id: number): Promise<AnimeMedia | null> {
  const query = `
    query AnimeDetails($id: Int) {
      Media(id: $id, type: ANIME) {
        id
        title { romaji english native }
        coverImage { extraLarge large medium color }
        bannerImage
        description(asHtml: false)
        episodes
        duration
        status
        season
        seasonYear
        averageScore
        popularity
        favourites
        genres
        format
        source
        studios {
          nodes { name }
        }
        trailer { id site }
        nextAiringEpisode { episode timeUntilAiring airingAt }
        relations {
          edges {
            relationType
            node {
              id
              title { romaji english native }
              coverImage { large medium }
              format
              averageScore
              status
            }
          }
        }
        characters(perPage: 12, sort: ROLE) {
          edges {
            role
            node {
              id
              name { full native }
              image { large }
            }
            voiceActors(language: JAPANESE) {
              id
              name { full }
              image { medium }
              language
            }
          }
        }
        recommendations(perPage: 8, sort: RATING_DESC) {
          nodes {
            mediaRecommendation {
              id
              title { romaji english native }
              coverImage { large medium extraLarge }
              averageScore
              format
            }
          }
        }
        siteUrl
        startDate { year month day }
      }
    }
  `;

  const data = await anilistQuery<{ Media: AnimeMedia }>(query, { id });
  return data?.Media || null;
}

export async function fetchCharacterDetails(id: number): Promise<CharacterDetail | null> {
  const query = `
    query CharacterDetails($id: Int) {
      Character(id: $id) {
        id
        name { full native alternative }
        image { large }
        description(asHtml: false)
        age
        gender
        bloodType
        dateOfBirth { year month day }
        siteUrl
      }
    }
  `;

  const data = await anilistQuery<{ Character: CharacterDetail }>(query, { id });
  return data?.Character || null;
}

export async function fetchRandomAnime(filters: {
  genre?: string;
  minScore?: string;
  format?: string;
}): Promise<AnimeMedia | null> {
  const filterArgs: string[] = ['type: ANIME', 'isAdult: false'];

  if (filters.genre) {
    filterArgs.push(`genre_in: [${JSON.stringify(filters.genre)}]`);
  }
  if (filters.minScore) {
    filterArgs.push(`averageScore_greater: ${filters.minScore}`);
  }
  if (filters.format) {
    filterArgs.push(`format: ${filters.format}`);
  }

  // Random page within top 10 pages for variety
  const randomPage = Math.floor(Math.random() * 8) + 1;

  const query = `
    query RandomAnime($page: Int) {
      Page(page: $page, perPage: 25) {
        media(${filterArgs.join(', ')}, sort: POPULARITY_DESC) {
          id
          title { romaji english native }
          coverImage { extraLarge large medium color }
          averageScore
          format
          seasonYear
          genres
        }
      }
    }
  `;

  const data = await anilistQuery<{ Page: { media: AnimeMedia[] } }>(query, { page: randomPage });
  if (!data?.Page?.media?.length) return null;

  const list = data.Page.media;
  const pick = list[Math.floor(Math.random() * list.length)];
  return pick;
}

export async function quickSearch(queryText: string): Promise<AnimeMedia[]> {
  if (!queryText || queryText.trim().length === 0) return [];

  const query = `
    query QuickSearch($search: String) {
      Page(page: 1, perPage: 8) {
        media(type: ANIME, search: $search, isAdult: false, sort: POPULARITY_DESC) {
          id
          title { romaji english native }
          coverImage { large medium }
          averageScore
          seasonYear
          format
          genres
        }
      }
    }
  `;

  const data = await anilistQuery<{ Page: { media: AnimeMedia[] } }>(query, {
    search: queryText.trim(),
  });

  return data?.Page?.media || [];
}
