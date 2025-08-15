import { supabase } from '@/lib/supabase/client';

export type SavedGameItem = {
  saved_at: string;
  id: number;
  name: string;
  metacritic_score: number | null;
  reviews_total: number | null;
  first_release_date: string | null;
  cover_url: string | null;
};

const FUNCTION_URL = process.env.NEXT_PUBLIC_FUNCTION_URL!;
if (!FUNCTION_URL) {
  console.warn('NEXT_PUBLIC_FUNCTION_URL 이 .env.local 에 설정되어야 합니다.');
}

/** 저장(좋아요) 토글 */
export async function toggleSaved(gameId: number) {
  const { data: session } = await supabase.auth.getSession();
  const token = session.session?.access_token;
  if (!token) throw new Error('로그인이 필요합니다.');

  const res = await fetch(`${FUNCTION_URL}/saved-games/toggle`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ game_id: gameId, source: 'like_button' }),
  });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as { saved: boolean };
}

/** 단건 저장 여부 */
export async function fetchIsSaved(gameId: number) {
  const { data: session } = await supabase.auth.getSession();
  const token = session.session?.access_token;
  if (!token) throw new Error('로그인이 필요합니다.');

  const res = await fetch(
    `${FUNCTION_URL}/saved-games/is-saved?game_id=${gameId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as { is_saved: boolean };
}

/** 마이페이지 저장 목록 (정렬 recent|mc|release) */
export async function fetchSavedList(
  params: {
    sort?: 'recent' | 'mc' | 'release';
    limit?: number;
    offset?: number;
  } = {},
) {
  const { sort = 'recent', limit = 30, offset = 0 } = params;

  const { data: session } = await supabase.auth.getSession();
  const token = session.session?.access_token;
  if (!token) throw new Error('로그인이 필요합니다.');

  const url = new URL(`${FUNCTION_URL}/saved-games/list`);
  url.searchParams.set('sort', sort);
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('offset', String(offset));

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as {
    items: Array<{
      saved_at: string;
      id: number;
      name: string;
      metacritic_score: number | null;
      reviews_total: number | null;
      first_release_date: string | null;
      cover_url: string | null;
    }>;
    count: number;
  };
}
