import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { AuthError } from "@supabase/supabase-js";
import { supabase } from "@/utils/supabase/client";

export interface User {
  id: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>;

  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,

      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),

      login: async (email, password) => {
        set({ isLoading: true });
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (!error && data.user) {
          set({ user: { id: data.user.id, email: data.user.email! } });
        } else {
          alert("로그인에 실패했습니다. 이메일과 비밀번호를 확인하세요.");
          console.error("로그인 실패:", error);
          set({ user: null });
        }

        set({ isLoading: false });
        return { error };
      },

      logout: async () => {
        set({ isLoading: true });
        const { error } = await supabase.auth.signOut();

        if (!error) {
          set({ user: null });
        } else {
          alert("로그아웃에 실패했습니다. 다시 시도해 주세요.");
          console.error("로그아웃 실패:", error);
        }

        set({ isLoading: false });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
