// app/games/page.tsx
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query';
import {
  fetchTopSellerIds,
  fetchCardsByOrderedIdsServer,
} from '@/lib/api/topSellers';
import Client from './client';

// ISR 주기(선택): Top Sellers가 자주 바뀌지 않으면 적절히 조정
export const revalidate = 300; // 5분

export default async function GamesPage() {
  const limit = 30;
  const offset = 0;

  const qc = new QueryClient();

  const idsResp = await qc.fetchQuery({
    queryKey: ['top-seller-ids', limit, offset],
    queryFn: () => fetchTopSellerIds(limit, offset),
    staleTime: 60_000,
  });

  if (idsResp?.ids?.length) {
    await qc.prefetchQuery({
      queryKey: ['top-seller-cards', limit, offset, idsResp.ids],
      queryFn: () => fetchCardsByOrderedIdsServer(idsResp.ids),
      staleTime: 60_000,
    });
  }

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      {/* <Client limit={limit} offset={offset}  /> */}
    </HydrationBoundary>
  );
}
