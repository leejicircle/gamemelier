'use client';

import { useFormStatus } from 'react-dom';
import { signupAction } from './actions';
import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfileStore } from '@/store/useProfileStore';

// (임시) 게임 장르 목록 예시 (실제론 Steam API에서 불러온 데이터로 대체)
const GENRES = [
  'Action',
  'Adventure',
  'RPG',
  'Strategy',
  'Simulation',
  'Puzzle',
  'Sports',
];

function GenreToggleList() {
  const favoriteGenres = useProfileStore((state) => state.favoriteGenres);
  const toggleGenre = useProfileStore((state) => state.toggleGenre);

  return (
    <div>
      <p className="mb-2 font-semibold">선호 장르 선택</p>
      <div className="flex flex-wrap gap-2">
        {GENRES.map((genre) => (
          <button
            key={genre}
            type="button"
            onClick={() => toggleGenre(genre)}
            className={`px-3 py-1 rounded ${
              favoriteGenres.includes(genre)
                ? 'bg-green-600 text-white'
                : 'bg-gray-300'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
}
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {pending ? '가입 중...' : '회원가입'}
    </button>
  );
}

export default function SignupPage() {
  const [state, formAction] = useActionState(signupAction, {
    error: '',
    success: false,
    user: undefined,
  });
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const favoriteGenres = useProfileStore((state) => state.favoriteGenres);
  const resetGenres = useProfileStore((state) => state.resetGenres);

  useEffect(() => {
    if (state?.success && state?.user) {
      console.log('회원가입 성공: Zustand 스토어 업데이트 및 리다이렉트 실행');
      setUser(state.user);
      resetGenres();
      router.push('/login');
    }
  }, [state?.success, state?.user, setUser, resetGenres, router]);

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
          {favoriteGenres.map((genre) => (
            <input
              key={genre}
              type="hidden"
              name="favoriteGenres"
              value={genre}
            />
          ))}
          <GenreToggleList />

          {state?.error && (
            <p className="text-red-500 text-sm mb-4 text-center">
              {state.error}
            </p>
          )}

          <SubmitButton />
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
