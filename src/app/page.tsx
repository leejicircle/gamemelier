import { createClient } from '@/lib/supabase/server';
import MainView from '@/components/main/MainView';

export default async function HomePage() {
  const supabase = await createClient();
  const initialFilters = { genres: [], isFree: undefined, priceMax: undefined };

  const { data: games } = await supabase
    .from('games')
    .select('app_id,name,header_image,genres,price_final,last_fetched_at')
    .order('last_fetched_at', { ascending: false })
    .limit(20);

  return (
    <MainView initialGames={games ?? []} initialFilters={initialFilters} />
  );
}
