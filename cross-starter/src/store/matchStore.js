import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DEFAULT_FILTERS = { gender: null, ageRange: [20, 35], tags: [] };

export const useMatchStore = create(
  persist(
    (set, get) => ({
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),
      filters: { ...DEFAULT_FILTERS },
      setFilters: (f) => set({ filters: { ...get().filters, ...f } }),
      liked: [],
      toggleLike: (id) => {
        const has = get().liked.includes(id);
        set({ liked: has ? get().liked.filter((x) => x !== id) : [...get().liked, id] });
      },
    }),
    {
      name: "cross-store",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => state?.setHydrated?.(),
    }
  )
);
