// app/mypage/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  fetchSavedList,
  type SavedGameItem,
} from '@/lib/queries/savedGamesApi';
import { CardsGrid } from '@/app/shared/components/CardsGrid';
import type { CardItem } from '@/types/games';
import GenreModal from './components/GenreModal';

export default function MyPage() {
  const [items, setItems] = useState<SavedGameItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);

      try {
        const { items: first } = await fetchSavedList();
        if (cancelled) return;
        setItems(first);
      } catch (e) {
        console.error('[mypage:first-load]', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const cardItems: CardItem[] = useMemo(
    () =>
      items.map((s) => ({
        id: s.id,
        name: s.name,
        image: s.cover_url ?? '',
      })),
    [items],
  );

  const savedSet = useMemo(() => new Set(items.map((s) => s.id)), [items]);
  function handleSavedChange(gameId: number, saved: boolean) {
    if (!saved) {
      setItems((prev) => prev.filter((x) => x.id !== gameId));
    }
  }

  return (
    <div className="container space-y-4">
      <CardsGrid
        title="저장한 게임"
        items={cardItems}
        isLoading={loading}
        savedSet={savedSet}
        onSavedChange={handleSavedChange}
      />
      {!loading && cardItems.length === 0 && (
        <div className="px-4 text-sm text-muted-foreground">
          저장한 게임이 없습니다.
        </div>
      )}
      <GenreModal />
    </div>
  );
}
