// src/lib/constants/genres.ts
export type GenreSlug =
  | 'all'
  | 'action'
  | 'rpg'
  | 'strategy'
  | 'adventure'
  | 'simulation'
  | 'sports_and_racing';

export const GENRE_LABEL: Record<GenreSlug, string> = {
  all: '전체',
  action: '액션',
  rpg: 'RPG',
  strategy: '전략',
  adventure: '어드벤처',
  simulation: '시뮬레이션',
  sports_and_racing: '스포츠·레이싱',
};

// Supabase genres.name (원문) 기준 묶음
export const GENRE_GROUPS_BY_SLUG: Record<GenreSlug, string[]> = {
  all: [],
  action: ['Action'],
  rpg: ['RPG'],
  strategy: ['Strategy'],
  adventure: ['Adventure'],
  simulation: ['Simulation'],
  sports_and_racing: ['Sports', 'Racing'],
};
