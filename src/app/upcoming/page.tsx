// src/app/upcoming/page.tsx
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { HydrationBoundary } from '@tanstack/react-query';
import UpcomingClient from './client';
import { CardItem } from '@/types';
import { createClient } from '@/lib/supabase/server';

export default async function UpcomingPage() {
  const LIMIT = 30;

  const qc = new QueryClient();
  const supabase = await createClient();
  await qc.prefetchInfiniteQuery({
    queryKey: ['upcoming-cards', LIMIT], // ← 훅과 동일
    initialPageParam: 0, // ← 첫 offset
    queryFn: async ({ pageParam }) => {
      const offset = pageParam as number;
      const { data, error } = await supabase.rpc('list_upcoming_games_cards', {
        p_limit: LIMIT,
        p_offset: offset,
      });
      if (error) throw new Error(error.message);

      const rows = (data ?? []) as CardItem[];
      return rows.map((r) => ({
        id: r.id,
        name: r.name,
        image: r.image,
        category: r.category ?? '기타',
      }));
    },
    staleTime: 60_000,
  });
  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <UpcomingClient limit={LIMIT} />
    </HydrationBoundary>
  );
}
