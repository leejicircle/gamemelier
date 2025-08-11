'use client';

import { useEffect } from 'react';
import { useAuthStore, User } from '@/store/useAuthStore';
import { supabase } from '@/lib/supabase/client';

export default function ClientAuthStatus({
  initialUser,
}: {
  initialUser: User | null;
}) {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    setUser(initialUser);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      try {
        if (session) {
          setUser({ id: session.user.id, email: session.user.email! });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('onAuthStateChange error:', error);
      }
    });

    return () => {
      try {
        subscription?.unsubscribe();
      } catch (error) {
        console.error('error', error);
      }
    };
  }, [initialUser, setUser]);

  return null;
}
