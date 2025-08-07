// app/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main style={{ padding: 20 }}>
      {user ? (
        <>
          <h1>환영합니다, {user.email}님!</h1>
          <p>여기는 로그인 후 볼 수 있는 홈 페이지입니다.</p>
        </>
      ) : (
        <>
          <h1>환영합니다!</h1>
          <p>로그인 후 더 많은 기능을 이용할 수 있습니다.</p>
          <a href="/login">로그인 하러 가기</a>
        </>
      )}
    </main>
  );
}
