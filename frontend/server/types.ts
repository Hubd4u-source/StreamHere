export interface EpisodeItem {
  number?: string | null;
  title?: string | null;
  url: string;
  poster?: string | null;
}

export interface RegionalLanguageInfo {
  isNonRegional: boolean;
  isSubbed: boolean;
  isDubbed: boolean;
  languageType: 'dubbed' | 'subbed' | 'unknown';
}

export interface SeasonItem {
  season: number | string;
  label: string;
  nonRegional: boolean;
  regionalLanguageInfo?: RegionalLanguageInfo;
}

export interface AnimeDetailsResponse {
  url: string;
  postId: number;
  season?: number | null;
  seasons: SeasonItem[];
  episodes: EpisodeItem[];
  poster?: string | null;
  genres?: string[];
  year?: number | null;
  totalEpisodes?: number | null;
  duration?: string | null;
  languages?: string[];
  synopsis?: string | null;
  status?: string | null;
  players?: PlayerSourceItem[];
  related?: { url: string; title?: string | null; poster?: string | null; genres?: string[]; postId?: number }[];
  smartButtons?: { url: string; actionText: string; episodeText: string; buttonClass: string }[];
}

export interface PlayerSourceItem {
  src: string;
  label?: string | null;
  quality?: string | null;
  kind: 'iframe' | 'video';
}

export interface SeriesListItem {
  title: string | null;
  url: string;
  image?: string | null;
  postId?: number;
}

export interface AnimeListResponse {
  page: number;
  items: SeriesListItem[];
}

