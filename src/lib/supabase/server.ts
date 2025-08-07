// lib/supabase/server.ts
'use server';

import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

export const createSupabaseServerClient = async () => {
  const cookieStore = cookies();
  return createServerComponentClient({ cookies: () => cookieStore });
};
