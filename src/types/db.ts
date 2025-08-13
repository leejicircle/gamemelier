// src/types/db.ts

export type RawPayload = {
  short_description: string | null;
  about_the_game: string | null;
  pc_requirements: {
    minimum_html: string | null;
    recommended_html: string | null;
  };
  movies: Array<{
    id: number;
    name: string | null;
    thumbnail: string | null;
    mp4_max: string | null;
  }>;
  screenshots: Array<{ id: number; full: string; thumb: string | null }>;
};

export type GameRow = {
  app_id: number;
  name: string;
  is_free: boolean;
  price_final: number | null;
  currency: string | null;
  release_date: Date | null;
  release_date_text: string | null;

  developers: string[];
  publishers: string[];
  genres: string[];
  categories: string[];
  metacritic: number | null;
  platforms: string[]; // 현재 스키마에 존재 → 빈 배열로라도 저장
  header_image: string | null;
  last_fetched_at: string;
  raw: RawPayload | null; // 축약본 저장
};
