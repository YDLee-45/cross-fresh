import React, { createContext, useContext, useMemo, useState } from "react";

const DICT = {
  ko: { starter: "CROSS 스타터", goLiked: "좋아요", goFilter: "필터", goProfile: "프로필 u1", theme: "테마", language: "언어", liked: "좋아요 목록", empty: "비어있음", toggleLike: "좋아요 토글" },
  ja: { starter: "CROSS スターター", goLiked: "いいね", goFilter: "フィルター", goProfile: "プロフィール u1", theme: "テーマ", language: "言語", liked: "いいね一覧", empty: "空です", toggleLike: "いいね切替" },
  en: { starter: "CROSS Starter", goLiked: "Liked", goFilter: "Filter", goProfile: "Profile u1", theme: "Theme", language: "Language", liked: "Liked List", empty: "Empty", toggleLike: "Toggle Like" }
};

const I18nCtx = createContext(null);
export function I18nProvider({ children }) {
  const [lang, setLang] = useState("ko");
  const t = useMemo(() => (k) => (DICT[lang]?.[k] ?? k), [lang]);
  return <I18nCtx.Provider value={{ lang, setLang, t }}>{children}</I18nCtx.Provider>;
}
export const useI18n = () => useContext(I18nCtx);
