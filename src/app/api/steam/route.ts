// import { NextResponse } from 'next/server';
// import supabaseAdminClient from '@/lib/supabase/adminClient';
// import { fetchAppList, fetchAppDetail } from '@/lib/steam/api';
// import { toDateOrNull, buildRawPayload } from '@/lib/steam/utils';
// import type { GameRow } from '@/types/db';
// import type { SteamAppDetail } from '@/types/steam';

// export const runtime = 'nodejs';

// const BATCH_SIZE = 200;
// const CONCURRENCY = 10;
// const DEFAULT_LIMIT = 200;

// async function runSyncAll(

//   limit: number,
// ): Promise<{ savedCount: number; totalTried: number }> {
//   const supabase = supabaseAdminClient;
//   // 1) 전체 앱 목록
//   const allApps = await fetchAppList();
//   const allAppIds = allApps.map((app) => app.appid);
//   const targetIds =
//     Number.isFinite(limit) && limit > 0 ? allAppIds.slice(0, limit) : allAppIds;

//   const buffer: GameRow[] = [];
//   let savedCount = 0;

//   // 2) 상세 호출(동시성 제한)
//   for (let start = 0; start < targetIds.length; start += CONCURRENCY) {
//     const batchIds = targetIds.slice(start, start + CONCURRENCY);

//     const rows = await Promise.all(
//       batchIds.map(async (appId) => {
//         const detail: SteamAppDetail | null = await fetchAppDetail(appId);
//         if (!detail || !detail.name) return null;

//         const row: GameRow = {
//           app_id: appId,
//           name: detail.name,
//           is_free: !!detail.is_free,
//           price_final: detail.price_overview?.final ?? null,
//           currency: detail.price_overview?.currency ?? null,
//           release_date: toDateOrNull(detail.release_date?.date),
//           developers: detail.developers ?? [],
//           publishers: detail.publishers ?? [],
//           genres: (detail.genres ?? []).map((g) => g.description),
//           categories: (detail.categories ?? []).map((c) => c.description),
//           metacritic: detail.metacritic?.score ?? null,
//           platforms: [], // 스키마에 컬럼이 있으므로 빈 배열 저장
//           header_image: detail.header_image ?? null,
//           last_fetched_at: new Date().toISOString(),
//           raw: buildRawPayload(detail, 10, 5),
//         };

//         return row;
//       }),
//     );

//     for (const row of rows) {
//       if (row) buffer.push(row);
//     }

//     if (buffer.length >= BATCH_SIZE) {
//       const toSave = buffer.splice(0, buffer.length);
//       const { error } = await supabase
//         .from('games')
//         .upsert(toSave, { onConflict: 'app_id' });
//       if (error) throw new Error(`upsert failed: ${error.message}`);
//       savedCount += toSave.length;
//     }
//   }

//   if (buffer.length > 0) {
//     const { error } = await supabase
//       .from('games')
//       .upsert(buffer, { onConflict: 'app_id' });
//     if (error) throw new Error(`upsert failed: ${error.message}`);
//     savedCount += buffer.length;
//   }

//   return { savedCount, totalTried: targetIds.length };
// }

// // GET: 헬스체크 + 실행 (?run=1&limit=200)
// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   if (searchParams.get('run') !== '1') {
//     return NextResponse.json({ ok: true, route: '/api/steam' });
//   }
//   const limitParam = searchParams.get('limit');
//   const limit = limitParam ? Number(limitParam) : DEFAULT_LIMIT;

//   try {
//     const result = await runSyncAll(limit);
//     return NextResponse.json({ ok: true, limit, ...result });
//   } catch (error: unknown) {
//     const message = error instanceof Error ? error.message : 'unknown';
//     return NextResponse.json({ ok: false, error: message }, { status: 500 });
//   }
// }

// // POST: 실행({ limit?: number })
// export async function POST(request: Request) {
//   const body = (await request.json().catch(() => ({}))) as {
//     limit?: number | string;
//   };
//   const numeric =
//     typeof body.limit === 'number'
//       ? body.limit
//       : typeof body.limit === 'string'
//         ? Number(body.limit)
//         : Number.NaN;

//   const limit =
//     Number.isFinite(numeric) && numeric > 0 ? numeric : DEFAULT_LIMIT;

//   try {
//     const result = await runSyncAll(limit);
//     return NextResponse.json({ ok: true, limit, ...result });
//   } catch (error: unknown) {
//     const message = error instanceof Error ? error.message : 'unknown';
//     return NextResponse.json({ ok: false, error: message }, { status: 500 });
//   }
// }
