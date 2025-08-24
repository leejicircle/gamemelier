'use client';

import { CardsCarousel } from '@/app/shared/components/CardsCarousel';
import { useTopSellerCards } from '@/lib/hooks/useTopSellerCards';
import { useUpcomingCards } from '@/lib/hooks/useUpcomingCards';

export default function MainClient({
  limit = 10,
  offset = 0,
}: {
  limit?: number;
  offset?: number;
}) {
  const { cardsQuery } = useTopSellerCards(limit, offset);
  const { data: upcoming = [], isLoading: isUpcomingLoading } =
    useUpcomingCards(limit, offset);
  return (
    <div className="space-y-[120px] mb-[120px]">
      <CardsCarousel
        title="인기게임 TOP"
        items={cardsQuery.data ?? []}
        isLoading={cardsQuery.isLoading}
      />
      <CardsCarousel
        title="출시예정"
        items={upcoming}
        isLoading={isUpcomingLoading}
      />
      <div></div>
    </div>
  );
}
