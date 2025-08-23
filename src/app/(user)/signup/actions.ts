'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { User } from '@/store/useAuthStore';
import { toKoAuthError } from '@/lib/utils';

function toGenres(arr: FormDataEntryValue[]): string[] {
  const flat = arr
    .flatMap((v) => (Array.isArray(v) ? v : [v]))
    .map((v) => String(v).trim())
    .filter(Boolean);
  return [...new Set(flat)];
}

export async function signupAction(
  prevState: { error: string; success?: boolean; user?: User },
  formData: FormData,
) {
  const supabase = await createClient();

  const email = (formData.get('email') as string)?.trim();
  const password = formData.get('password') as string;
  const nickname = (formData.get('nickname') as string)?.trim();
  const favoriteGenresRaw = formData.getAll('favoriteGenres');
  const favoriteGenres = toGenres(favoriteGenresRaw);

  if (!email || !password) {
    return { error: '이메일과 비밀번호를 입력해주세요.', success: false };
  }
  if (password.length < 6) {
    return { error: '비밀번호는 최소 6자 이상이어야 합니다.', success: false };
  }
  if (nickname && nickname.length > 10) {
    return { error: '닉네임은 10자 이내로 입력해주세요.', success: false };
  }

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });
  if (authError) {
    return { error: toKoAuthError(authError), success: false };
  }

  const hasSession = Boolean(authData.session);
  const userId = authData.user?.id;

  if (hasSession && userId) {
    if (nickname) {
      const { error } = await supabase
        .from('profiles')
        .update({ nickname })
        .eq('id', userId);
      if (error) {
        console.error('[profiles.nickname] update 에러:', error.message);
      }
    }

    if (favoriteGenres.length > 0) {
      const { error: rpcError } = await supabase.rpc('set_signup_genres', {
        p_genres: favoriteGenres,
      });
      if (rpcError) {
        console.error('[set_signup_genres] RPC 에러:', rpcError.message);
      }
    }
  }

  revalidatePath('/', 'layout');
  return {
    error: '',
    success: true,
    user: authData.user
      ? { id: authData.user.id, email: authData.user.email! }
      : undefined,
  };
}
