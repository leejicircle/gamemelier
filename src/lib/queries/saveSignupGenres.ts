import { supabase } from '@/lib/supabase/client';

/*
 * 회원가입에서 선택한 장르를 저장
 */
export async function saveSignupGenres(genres: string[]) {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) throw new Error('로그인이 필요합니다.');
  const { error } = await supabase.rpc('set_signup_genres', {
    p_genres: genres,
  });
  if (error) throw error;
}
