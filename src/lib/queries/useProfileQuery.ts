import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';

export type Profile = {
  id: string;
  steam_api_key: string | null;
  favorite_genres: string[] | null;
  created_at: string;
};

export const useProfileQuery = (userId?: string) => {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async (): Promise<Profile | null> => {
      if (!userId) return null;

      // row 없을 때 throw 대신 data=null 반환
      const { data, error } = await supabase
        .from('profiles')
        .select('id, steam_api_key, favorite_genres, created_at')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      return (data as Profile) ?? null;
    },
    enabled: !!userId,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    retry: (count, err: Error) => {
      const msg = err?.message ?? '';
      if (/JWT|Unauthorized|permission|RLS/i.test(msg)) return false;
      return count < 2;
    },
  });
};
