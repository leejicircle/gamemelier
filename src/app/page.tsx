import ClientAuthStatus from "@/components/auth/ClientAuthStatus";
import AuthButtons from "@/components/auth/AuthButtons";

import { createClient } from "@/utils/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log(user?.email);
  return (
    <main style={{ padding: "20px" }}>
      {user ? (
        <>
          <h1>환영합니다, {user.email}님!</h1>
          {/* 클라이언트 컴포넌트에 초기 로그인 상태 전달 */}
          <ClientAuthStatus initialUser={{ id: user.id, email: user.email! }} />

          <AuthButtons />
        </>
      ) : (
        <>
          <h1>환영합니다!</h1>
          {/* 비로그인 상태임을 클라이언트 컴포넌트에 전달 */}
          <ClientAuthStatus initialUser={null} />

          <AuthButtons />
        </>
      )}
    </main>
  );
}
