// src/lib/steam/api.ts
import type { SteamAppDetail, SteamAppListItem } from '@/types/steam';

export async function fetchAppList(): Promise<SteamAppListItem[]> {
  const url = 'https://api.steampowered.com/ISteamApps/GetAppList/v2/';
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`AppList fetch failed: ${response.status}`);
  }
  const json = (await response.json()) as {
    applist?: { apps?: SteamAppListItem[] };
  };
  return json.applist?.apps ?? [];
}

export async function fetchAppDetail(
  appId: number,
): Promise<SteamAppDetail | null> {
  const url = `https://store.steampowered.com/api/appdetails?appids=${appId}&cc=kr&l=korean`;
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) return null;
  const json = (await response.json()) as Record<
    number,
    { data?: SteamAppDetail } | undefined
  >;
  return json[appId]?.data ?? null;
}
