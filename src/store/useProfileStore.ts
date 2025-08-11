// src/store/useProfileStore.ts
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ProfileState {
  favoriteGenres: string[];
  toggleGenre: (genre: string) => void;
  resetGenres: () => void;
  setGenres: (genres: string[]) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      favoriteGenres: [],
      toggleGenre: (genre) => {
        const { favoriteGenres } = get();
        if (favoriteGenres.includes(genre)) {
          set({ favoriteGenres: favoriteGenres.filter((g) => g !== genre) });
        } else {
          set({ favoriteGenres: [...favoriteGenres, genre] });
        }
      },
      resetGenres: () => set({ favoriteGenres: [] }),
      setGenres: (genres) => set({ favoriteGenres: genres }),
    }),
    {
      name: "profile-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
