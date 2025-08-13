// src/types/steam.ts

export type SteamGenre = { id: string; description: string };
export type SteamCategory = { id: number; description: string };

export type SteamMovie = {
  id: number;
  name?: string;
  thumbnail?: string;
  highlight?: boolean;
  mp4?: { 480?: string; max?: string };
};

export type SteamScreenshot = {
  id: number;
  path_full: string;
  path_thumbnail?: string;
};

export type SteamAppListItem = {
  appid: number;
  name: string;
};

export interface SteamAppDetail {
  name: string;
  is_free: boolean;
  price_overview?: { final: number; currency: string };
  release_date?: { date: string; coming_soon?: boolean };
  developers?: string[];
  publishers?: string[];
  genres?: SteamGenre[];
  categories?: SteamCategory[];
  metacritic?: { score: number; url?: string };
  platforms?: { windows?: boolean; mac?: boolean; linux?: boolean };
  header_image?: string;
  short_description?: string;
  about_the_game?: string; // HTML
  pc_requirements?: string | { minimum?: string; recommended?: string };
  movies?: SteamMovie[];
  screenshots?: SteamScreenshot[];
  [key: string]: unknown;
}
