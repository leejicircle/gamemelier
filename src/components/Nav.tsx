'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { supabase } from '@/lib/supabase/client';

export default function Nav() {
  const user = useAuthStore((state) => state.user);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="p-4 bg-gray-200 flex justify-between">
      <div>MyApp</div>

      <div>
        {user ? (
          <>
            <span className="mr-4">안녕하세요, {user.email}님</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="mr-4">
              로그인
            </Link>
            <Link href="/signup">회원가입</Link>
          </>
        )}
      </div>
    </nav>
  );
}
