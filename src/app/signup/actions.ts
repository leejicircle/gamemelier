'use server';

import supabaseAdmin from '@/lib/supabase/adminClient';
import { createClient } from '@/lib/supabase/server';
import { User } from '@/store/useAuthStore';

import { revalidatePath } from 'next/cache';

export async function signupAction(
  prevState: { error: string; success?: boolean; user?: User },
  formData: FormData,
) {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const favoriteGenresRaw = formData.getAll('favoriteGenres');
  console.log('favoriteGenresRaw:', favoriteGenresRaw);

  if (!email || !password) {
    return {
      error: '이메일과 비밀번호를 입력해주세요.',
      success: false,
    };
  }
  if (password.length < 6) {
    return {
      error: '비밀번호는 최소 6자 이상이어야 합니다.',
      success: false,
    };
  }

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    return {
      error: authError.message,
      success: false,
    };
  }

  const { error: profileError } = await supabaseAdmin.from('profiles').insert([
    {
      id: authData.user?.id,
      favorite_genres: favoriteGenresRaw,
      created_at: new Date().toISOString(),
    },
  ]);

  if (profileError) {
    console.error('Profile insert error:', profileError.message);
    return {
      error: profileError.message,
      success: false,
    };
  }

  revalidatePath('/', 'layout');

  return {
    error: '',
    success: true,
    user: authData.user
      ? {
          id: authData.user.id,
          email: authData.user.email!,
        }
      : undefined,
  };
}
