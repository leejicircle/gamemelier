import type { Metadata } from 'next';

import './globals.css';
import { createClient } from '@/lib/supabase/server';
import ClientAuthStatus from '@/components/auth/ClientAuthStatus';
import Nav from '@/components/Nav';
import Providers from './provider';

export const metadata: Metadata = {
  title: 'GameMelier',
  description: '게임 정보 맛보기',
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <html lang="ko">
      <body>
        <Providers>
          <ClientAuthStatus
            initialUser={user ? { id: user.id, email: user.email! } : null}
          />

          <Nav />

          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
