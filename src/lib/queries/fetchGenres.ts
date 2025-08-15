import { supabase } from '@/lib/supabase/client';
export type Genre = { id: number; name: string };
export async function fetchGenres(): Promise<Genre[]> {
  const { data, error } = await supabase
    .from('genres')
    .select('id, name')
    .order('name');
  if (error) throw error;
  return data ?? [];
}
