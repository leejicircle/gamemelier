import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { GameRow } from '@/types/db';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const page = Number(searchParams.get('page') ?? '1');
  const pageSize = Number(searchParams.get('pageSize') ?? '20');
  const genre = searchParams.get('genre') ?? '';
  const keyword = searchParams.get('q') ?? '';

  const supabase = await createClient();

  let query = supabase
    .from('games')
    .select('*')
    .order('last_fetched_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (genre) {
    query = query.contains('genres', [genre]);
  }

  if (keyword) {
    query = query.ilike('name', `%${keyword}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    page,
    pageSize,
    total: count ?? data.length,
    items: data as GameRow[],
  });
}
