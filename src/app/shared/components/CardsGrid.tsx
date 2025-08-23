// src/components/cards/CardsGrid.tsx
'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { CardItem } from '@/types/games';
import SaveToggleButton from './saveToggleButton';
import { useRouter } from 'next/navigation';

interface CardsGridProps {
  items: CardItem[];
  title?: string;
  isLoading?: boolean;
  savedSet?: Set<number>;
  onSavedChange?: (gameId: number, saved: boolean) => void;
}

export function CardsGrid({
  items,
  title,
  isLoading,
  savedSet,
  onSavedChange,
}: CardsGridProps) {
  const showSkeleton = isLoading ?? items.length === 0;
  const skeletonCount = showSkeleton ? 8 : items.length;
  const router = useRouter();

  return (
    <section>
      {title && (
        <h1 className="mb-3 text-white text-4xl font-bold leading-[50.40px]">
          {title}
        </h1>
      )}

      <div className="w-full grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {showSkeleton
          ? Array.from({ length: skeletonCount }).map((_, idx) => (
              <Card key={idx} className="flex gap-2 w-[460px] h-[293px]">
                <div>
                  <div className="relative w-[460px] h-[215px] rounded-xl bg-muted">
                    <Skeleton className="absolute inset-0 h-full w-full" />
                    <div className="absolute right-4 bottom-4 z-10">
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                  </div>
                </div>

                <CardContent className="p-0 bg-transparent flex-1">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/3" />
                </CardContent>
              </Card>
            ))
          : items.map((game, i) => (
              <Card
                key={game.id}
                className="flex gap-2"
                onClick={() => router.push(`/games/${game.id}`)}
              >
                {game.image ? (
                  <div className="relative gradient-border-wrap w-[380px] h-[205px]">
                    <div className="gradient-border-content w-full h-full">
                      <Image
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1440px) 50vw, 33vw"
                        src={game.image}
                        alt={game.name}
                        priority={i === 0}
                        className=" object-cover rounded-xl "
                      />
                    </div>
                    <div className="absolute right-4 bottom-4 z-10">
                      <SaveToggleButton
                        gameId={game.id}
                        initialSaved={savedSet?.has(game.id)}
                        onChange={(saved) => onSavedChange?.(game.id, saved)}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-[215px] bg-muted" />
                )}

                <CardContent className="bg-transparent">
                  <h3 className="line-clamp-2 text-md font-semibold text-gray-500">
                    {game.name}
                  </h3>
                  {game.category && (
                    <div className="mt-1 text-m font-semibold text-foreground">
                      {game.category}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
      </div>
    </section>
  );
}
