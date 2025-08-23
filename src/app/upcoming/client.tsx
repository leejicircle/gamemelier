// src/app/upcoming/client.tsx
'use client';

import { useMemo } from 'react';
import { CardsGrid } from '@/app/shared/components/CardsGrid';
import { Button } from '@/components/ui/button';
import { useInfiniteUpcomingCards } from '@/lib/hooks/useUpcomingCards';

type Props = {
  limit?: number;
};

export default function UpcomingClient({ limit = 30 }: Props) {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteUpcomingCards(limit);

  const items = useMemo(() => data?.pages.flatMap((p) => p) ?? [], [data]);

  const isEmpty = !isLoading && !isError && items.length === 0;

  return (
    <section className="container mx-auto px-4 py-6 mb-6">
      <CardsGrid title="출시 예정작" items={items} isLoading={isLoading} />

      {isError && (
        <p className="mt-4 text-sm text-red-400">
          불러오는 중 오류가 발생했어요: {(error as Error)?.message}
        </p>
      )}

      {isEmpty && (
        <p className="mt-4 text-sm text-muted-foreground">
          표시할 게임이 없습니다.
        </p>
      )}

      {hasNextPage && (
        <div className="mt-6 flex justify-center">
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            variant="purple"
          >
            {isFetchingNextPage ? '불러오는 중…' : '더 보기'}
          </Button>
        </div>
      )}
    </section>
  );
}
