import { create } from "zustand";
import { ENABLE_OSS20B } from "../config/aiConfig";

export const useFlags = create((set) => ({
  enableOss20b: ENABLE_OSS20B,
  setEnableOss20b: (v) => set({ enableOss20b: !!v }),
}));
