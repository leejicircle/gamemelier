'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { User } from '@/store/useAuthStore';

function toGenres(arr: FormDataEntryValue[]): string[] {
  // FormData.getAll('favoriteGenres') → (string|string[]) 혼재 가능성 대비
  const flat = arr
    .flatMap((v) => (Array.isArray(v) ? v : [v]))
    .map((v) => String(v).trim())
    .filter(Boolean);
  // 중복 제거 + 순서 유지
  return [...new Set(flat)];
}

export async function signupAction(
  prevState: { error: string; success?: boolean; user?: User },
  formData: FormData,
) {
  const supabase = await createClient();

  const email = (formData.get('email') as string)?.trim();
  const password = formData.get('password') as string;
  const favoriteGenresRaw = formData.getAll('favoriteGenres');
  const favoriteGenres = toGenres(favoriteGenresRaw);

  if (!email || !password) {
    return { error: '이메일과 비밀번호를 입력해주세요.', success: false };
  }
  if (password.length < 6) {
    return { error: '비밀번호는 최소 6자 이상이어야 합니다.', success: false };
  }

  // 1) 회원가입
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });
  if (authError) {
    return { error: authError.message, success: false };
  }

  const hasSession = Boolean(authData.session);

  // 3) 선호 장르 RPC 호출
  // - profiles.favorite_genres 저장
  // - user_genre_preferences에 weight=1.0 시드
  if (hasSession && favoriteGenres.length > 0) {
    const { error: rpcError } = await supabase.rpc('set_signup_genres', {
      p_genres: favoriteGenres,
    });
    if (rpcError) {
      // RPC 실패해도 회원가입 자체는 성공 → 메시지만 남기고 진행
      console.error('[set_signup_genres] RPC error:', rpcError.message);
    }
  }

  // 4) 반환
  revalidatePath('/', 'layout');
  return {
    error: '',
    success: true,
    user: authData.user
      ? { id: authData.user.id, email: authData.user.email! }
      : undefined,
  };
}
