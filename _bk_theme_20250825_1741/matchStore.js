import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DEFAULT_FILTERS = { gender: null, ageRange: [20, 35] };

const useMatchStore = create(
  persist(
    (set, get) => ({
      likedIds: [],
      filters: { ...DEFAULT_FILTERS },
      lang: "ko",
      hydrated: false,

      like: (id) => set((s) => (s.likedIds.includes(id) ? s : { likedIds: [...s.likedIds, id] })),
      dislike: (id) => set((s) => ({ likedIds: s.likedIds.filter((x) => x !== id) })),
      resetLikes: () => set({ likedIds: [] }),

      setFilters: (f) => set({ filters: { ...get().filters, ...f } }),
      resetFilters: () => set({ filters: { ...DEFAULT_FILTERS } }),

      setLang: (code) => set({ lang: code }),

      markHydrated: () => set({ hydrated: true }),
    }),
    {
      name: "cross-store",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state, error) => {
        if (state && state.markHydrated) state.markHydrated();
      },
      partialize: (s) => ({ likedIds: s.likedIds, filters: s.filters, lang: s.lang })
    }
  )
);

export default useMatchStore;
