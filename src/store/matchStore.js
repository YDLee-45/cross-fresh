// src/store/matchStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialFilters = {
  gender: 'all',          // 'male' | 'female' | 'all'
  ageRange: [20, 40],     // [min, max]
  tags: [],               // ['kind','calm',...]
};

const normTags = (tags) => (Array.isArray(tags) ? tags.map(String) : []);
const flatten = (person = {}, score = null) => ({
  id: String(person.id ?? person.name ?? Date.now()),
  name: String(person.name ?? ''),
  age: Number(person.age ?? 0),
  gender: person.gender ?? 'other',
  tags: normTags(person.tags),
  score,
});

const normalizeList = (list = []) =>
  list.map((r) => (r && r.person ? flatten(r.person, r.score) : flatten(r, r.score)));

const useMatchStore = create(
  persist(
    (set, get) => ({
      // ----- State -----
      filters: initialFilters,
      results: [],          // 평탄화된 결과: {id,name,age,gender,tags,score}
      liked: [],            // string ID 배열
      hydrated: false,

      // ----- Actions -----
      setFilters: (payload = {}) =>
        set((s) => ({ filters: { ...s.filters, ...payload } })),

      resetFilters: () => set({ filters: initialFilters }),

      setResults: (list = []) => set({ results: normalizeList(list) }),

      addResult: (person, score) =>
        set((s) => ({ results: [...s.results, flatten(person, score)] })),

      clearResults: () => set({ results: [] }),

      toggleLike: (id) =>
        set((s) => {
          const strId = String(id);
          const has = s.liked.includes(strId);
          return { liked: has ? s.liked.filter((x) => x !== strId) : [...s.liked, strId] };
        }),

      setLiked: (ids = []) => set({ liked: ids.map(String) }),

      applyFilterFromLink: (payload = {}) =>
        set((s) => ({ filters: { ...s.filters, ...payload } })),

      applyLikedFromLink: (ids = []) => set({ liked: ids.map(String) }),
    }),
    {
      name: 'cross-store',
      version: 2,
      storage: createJSONStorage(() => AsyncStorage),
      migrate: async (state, ver) => {
        // v1 -> v2: { person, score } 배열을 평탄화
        if (ver < 2 && state && Array.isArray(state.results)) {
          return { ...state, results: normalizeList(state.results) };
        }
        return state;
      },
      onRehydrateStorage: () => () => {
        // 하이드레이션 완료 플래그
        useMatchStore.setState({ hydrated: true });
      },
    }
  )
);

export default useMatchStore;
