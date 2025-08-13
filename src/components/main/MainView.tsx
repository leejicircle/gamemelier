'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

type Game = {
  app_id: number;
  name: string;
  header_image: string | null;
  genres: string[] | null;
  price_final: number | null;
  last_fetched_at: string;
};
type Filters = { genres: string[]; isFree?: boolean; priceMax?: number };

async function fetchGames(filters: Filters): Promise<Game[]> {
  const params = new URLSearchParams();
  if (filters.genres.length) params.set('genres', filters.genres.join(','));
  if (typeof filters.isFree === 'boolean')
    params.set('isFree', String(filters.isFree));
  if (filters.priceMax) params.set('priceMax', String(filters.priceMax));

  const res = await fetch(`/api/games?${params.toString()}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('failed to load games');
  return res.json();
}

export default function MainView({
  initialGames,
  initialFilters,
}: {
  initialGames: Game[];
  initialFilters: Filters;
}) {
  const [filters, setFilters] = useState<Filters>(initialFilters);

  // 쿼리키는 필터 값에 의존 (캐시 분기)
  const queryKey = useMemo(() => ['games', filters], [filters]);

  const { data: games, isFetching } = useQuery({
    queryKey,
    queryFn: () => fetchGames(filters),
    // 서버에서 받은 초기 데이터를 그대로 초기값으로 사용 (첫 렌더 깜빡임 X)
    initialData: initialGames,
    // 필터가 바뀌지 않은 첫 렌더에서는 네트워크 호출 안 함
    // (필요하면 keepPreviousData 등 추가)
  });

  return (
    <main className="p-6">
      {/* 아주 간단한 필터 UI 예시 */}
      <div className="mb-4 flex gap-2">
        <button onClick={() => setFilters((f) => ({ ...f, isFree: true }))}>
          무료만
        </button>
        <button
          onClick={() => setFilters((f) => ({ ...f, isFree: undefined }))}
        >
          전체
        </button>
      </div>

      {isFetching && <div>로딩 중...</div>}

      <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {games.map((g) => (
          <li key={g.app_id} className="border rounded p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={g.header_image ?? ''}
              alt={g.name}
              className="w-full h-40 object-cover"
            />
            <div className="mt-2 font-medium">{g.name}</div>
            <div className="text-sm opacity-70">{g.genres?.join(', ')}</div>
            <div className="text-sm">
              {g.price_final ? `${g.price_final.toLocaleString()}원` : '무료'}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
