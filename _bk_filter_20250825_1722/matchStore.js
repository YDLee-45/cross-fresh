import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useMatchStore = create(
  persist(
    (set, get) => ({
      likedIds: [],
      hydrated: false,

      like: (id) => set((s) => (s.likedIds.includes(id) ? s : { likedIds: [...s.likedIds, id] })),
      dislike: (id) => set((s) => ({ likedIds: s.likedIds.filter((x) => x !== id) })),
      resetLikes: () => set({ likedIds: [] }),
      markHydrated: () => set({ hydrated: true }),
    }),
    {
      name: "cross-like-store",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state, error) => {
        // 하이드레이션 완료 플래그
        if (state && state.markHydrated) state.markHydrated();
      },
      partialize: (s) => ({ likedIds: s.likedIds }) // 필요한 키만 저장
    }
  )
);

export default useMatchStore;
