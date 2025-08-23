import type { Metadata } from 'next';

import './globals.css';
import { createClient } from '@/lib/supabase/server';
import ClientAuthStatus from '@/components/auth/ClientAuthStatus';

import Providers from './provider';
import { Footer } from './shared/Footer';
import Nav from './shared/Nav';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: 'GameMelier',
  description: '게임 정보 맛보기',
};

import localFont from 'next/font/local';

export const pretendard = localFont({
  src: [
    {
      path: '/fonts/pretendard/Pretendard-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '/fonts/pretendard/Pretendard-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '/fonts/pretendard/Pretendard-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '/fonts/pretendard/Pretendard-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-pretendard',
  display: 'swap',
});
export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <html lang="ko">
      <body className={`${pretendard.variable} font-sans`}>
        <Providers>
          <ClientAuthStatus
            initialUser={user ? { id: user.id, email: user.email! } : null}
          />
          <Nav />
          <main>{children}</main>
          <Toaster richColors position="top-right" />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
