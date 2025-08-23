'use client';

import { useState } from 'react';
import { CardsGrid } from '@/app/shared/components/CardsGrid';
import { useTopSellerCards } from '@/lib/hooks/useTopSellerCards';
import type { CardItem } from '@/types/games';

const PAGE_SIZE = 30;

export default function GamesPage() {
  const [offset, setOffset] = useState(0);
  const { topSellerIdsQuery, cardsQuery } = useTopSellerCards(
    PAGE_SIZE,
    offset,
  );

  const items: CardItem[] = cardsQuery.data ?? [];
  const nextOffset = topSellerIdsQuery.data?.nextOffset ?? null;

  const canPrev = offset > 0;
  const canNext = nextOffset !== null;
  const isLoading = topSellerIdsQuery.isLoading || cardsQuery.isLoading;

  const goPrev = () => setOffset(Math.max(0, offset - PAGE_SIZE));
  const goNext = () => {
    if (nextOffset !== null) setOffset(nextOffset);
  };

  return (
    <section className="container space-y-4">
      <CardsGrid title="전체 인기게임" items={items} isLoading={isLoading} />

      <div className="flex items-center justify-between">
        <button
          className="px-3 py-2 rounded bg-muted disabled:opacity-50"
          onClick={goPrev}
          disabled={!canPrev || isLoading}
        >
          이전
        </button>

        <div className="text-sm text-muted-foreground">
          page {Math.floor(offset / PAGE_SIZE) + 1}
        </div>

        <button
          className="px-3 py-2 rounded bg-primary text-primary-foreground disabled:opacity-50"
          onClick={goNext}
          disabled={!canNext || isLoading}
        >
          다음
        </button>
      </div>
    </section>
  );
}
