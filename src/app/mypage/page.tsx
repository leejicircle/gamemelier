'use client';

import { useEffect, useState } from 'react';
import {
  fetchSavedList,
  type SavedGameItem,
} from '@/lib/queries/savedGamesApi';
import GameCard from '@/components/main/GameCard';

export default function MyPage() {
  const [items, setItems] = useState<SavedGameItem[]>([]);
  const [sort, setSort] = useState<'recent' | 'mc' | 'release'>('recent');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { items } = await fetchSavedList({ sort, limit: 30, offset: 0 });
        setItems(items);
      } finally {
        setLoading(false);
      }
    })();
  }, [sort]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <select
          value={sort}
          onChange={(e) =>
            setSort(e.target.value as 'recent' | 'mc' | 'release')
          }
          className="border px-2 py-1 rounded"
        >
          <option value="recent">최근 저장순</option>
          <option value="mc">메타크리틱 순</option>
          <option value="release">발매일 최신</option>
        </select>
      </div>

      {loading ? (
        <div>불러오는 중…</div>
      ) : items.length === 0 ? (
        <div>저장한 게임이 없습니다.</div>
      ) : (
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <li key={item.id}>
              <GameCard item={item} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
