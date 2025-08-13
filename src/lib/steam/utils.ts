// src/lib/steam/utils.ts
import type {
  SteamAppDetail,
  SteamMovie,
  SteamScreenshot,
} from '@/types/steam';
import type { RawPayload } from '@/types/db';

// 문자열 → Date (실패 시 null)
export function toDateOrNull(input?: string): Date | null {
  if (!input) return null;
  const dateObject = new Date(input);
  return Number.isNaN(dateObject.getTime()) ? null : dateObject;
}

// Steam 상세 응답에서 필요한 부가 정보만 추려 raw 축약본 구성
export function buildRawPayload(
  detail: SteamAppDetail,
  imageLimit: number,
  videoLimit: number,
): RawPayload {
  const movies: RawPayload['movies'] = (detail.movies ?? [])
    .slice(0, videoLimit)
    .map((movie: SteamMovie) => ({
      id: movie.id,
      name: movie.name ?? null,
      thumbnail: movie.thumbnail ?? null,
      mp4_max: movie.mp4?.max ?? null,
    }));

  const screenshots: RawPayload['screenshots'] = (detail.screenshots ?? [])
    .slice(0, imageLimit)
    .map((shot: SteamScreenshot) => ({
      id: shot.id,
      full: shot.path_full,
      thumb: shot.path_thumbnail ?? null,
    }));

  const minimum_html =
    typeof detail.pc_requirements === 'string'
      ? detail.pc_requirements
      : (detail.pc_requirements?.minimum ?? null);

  const recommended_html =
    typeof detail.pc_requirements === 'string'
      ? null
      : (detail.pc_requirements?.recommended ?? null);

  return {
    short_description: detail.short_description ?? null,
    about_the_game: detail.about_the_game ?? null,
    pc_requirements: { minimum_html, recommended_html },
    movies,
    screenshots,
  };
}
