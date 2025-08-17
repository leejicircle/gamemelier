'use client';

import { signupAction } from './actions';
import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfileStore } from '@/store/useProfileStore';
import SubmitButton from '@/components/SubmitButton';
import GenreToggleList from './components/GenreToggleList';

import { useQuery } from '@tanstack/react-query';
import { fetchGenresByIds } from '@/lib/queries/fetchGenres';

export default function SignupPage() {
  const [state, formAction] = useActionState(signupAction, {
    error: '',
    success: false,
    user: undefined,
  });
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const favoriteGenres = useProfileStore((s) => s.favoriteGenres);
  const toggleGenre = useProfileStore((s) => s.toggleGenre);
  const resetGenres = useProfileStore((s) => s.resetGenres);

  const ids = [1, 3];
  // 🔹 DB에서 장르 로드 (React Query)
  const { data: genresData, isLoading } = useQuery({
    queryKey: ['genres', ids],
    queryFn: () => fetchGenresByIds(ids),
    staleTime: 60_000,
  });
  // const { data: genresData, isLoading } = useQuery({
  //   queryKey: ['genres'],
  //   queryFn: fetchGenres,
  //   staleTime: 60_000,
  // });

  useEffect(() => {
    if (state?.success && state?.user) {
      setUser(state.user);
      resetGenres(); // 가입 완료 후 선택값 초기화
      router.push('/login');
    }
  }, [state?.success, state?.user, setUser, resetGenres, router]);

  // 화면에 뿌릴 장르 이름 배열 (로딩/실패 fallback)
  const genreNames = (genresData ?? []).map((g) => g.name);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">회원가입</h1>

        <form action={formAction} className="space-y-4">
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              이메일
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="이메일을 입력하세요"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              비밀번호
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="비밀번호를 입력하세요 (최소 6자)"
            />
          </div>

          {/* 선택된 장르를 서버 액션으로 보내기 위한 hidden inputs */}
          {favoriteGenres.map((genre) => (
            <input
              key={genre}
              type="hidden"
              name="favoriteGenres"
              value={genre}
            />
          ))}

          {/* 🔹 장르 토글 UI (로딩 중엔 비활성/스켈레톤 처리) */}
          <GenreToggleList
            genres={genreNames}
            favoriteGenres={favoriteGenres}
            toggleGenre={toggleGenre}
          />
          {isLoading && (
            <p className="text-xs text-gray-400">장르 불러오는 중…</p>
          )}

          {state?.error && (
            <p className="text-red-500 text-sm mb-4 text-center">
              {state.error}
            </p>
          )}

          <SubmitButton text="회원가입" />
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            이미 계정이 있으신가요?{' '}
            <Link
              href="/login"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
