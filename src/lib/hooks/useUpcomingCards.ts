'use client';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import type { CardItem } from '@/types';

type RpcUpcomingRow = {
  id: number;
  name: string;
  image: string | null;
  first_release_date: string | null;
};

async function getUpcomingCards(limit = 30, offset = 0): Promise<CardItem[]> {
  const { data, error } = await supabase.rpc('list_upcoming_games_cards', {
    p_limit: limit,
    p_offset: offset,
  });
  if (error) throw error;

  const rows = (data ?? []) as RpcUpcomingRow[];
  return rows.map<CardItem>((r) => ({
    id: r.id,
    name: r.name,
    image: r.image,
  }));
}

export function useUpcomingCards(limit = 30, offset = 0) {
  return useQuery<CardItem[]>({
    queryKey: ['upcoming-cards', limit, offset] as const,
    queryFn: () => getUpcomingCards(limit, offset),
    staleTime: 60_000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    placeholderData: (prev) => prev,
  });
}

export function useInfiniteUpcomingCards(limit = 30) {
  return useInfiniteQuery<CardItem[], Error>({
    queryKey: ['upcoming-cards', limit] as const,
    initialPageParam: 0 as number, // offset
    queryFn: ({ pageParam }) => getUpcomingCards(limit, pageParam as number),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < limit) return undefined;

      return allPages.reduce((acc, page) => acc + page.length, 0);
    },
    staleTime: 60_000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
