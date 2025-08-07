// src/middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 보호 페이지 예시: /login-check
  if (!session && req.nextUrl.pathname.startsWith('/login-check')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return res;
}
