// src/config/aiConfig.js
import Constants from 'expo-constants';

// 1) app.json → expo.extra
const extra =
  (Constants?.expoConfig?.extra) ||
  (Constants?.manifest?.extra) ||
  {};

// 2) 환경변수(EXPO_PUBLIC_* 우선)
const env = {
  BASE:    process.env.EXPO_PUBLIC_AI_BASE_URL   || process.env.AI_BASE_URL,
  TIMEOUT: process.env.EXPO_PUBLIC_AI_TIMEOUT_MS || process.env.AI_TIMEOUT_MS,
  MODEL:   process.env.EXPO_PUBLIC_AI_MODEL      || process.env.AI_MODEL,
  KEY:     process.env.EXPO_PUBLIC_AI_API_KEY    || process.env.AI_API_KEY,
  ENABLE:  process.env.EXPO_PUBLIC_ENABLE_OSS20B || process.env.ENABLE_OSS20B,
};

// 유틸
const toBool = (v) =>
  v === true || v === 'true' || v === '1';
const toNum = (v, d) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
};

// 3) 마지막 폴백: 기본은 오프라인(빈 문자열)로 두면 즉시 폴백 동작
//  - 서버를 쓰고 싶으면 여기를 'http://<PC-IP>:5000' 으로 바꾸거나
//    EXPO_PUBLIC_AI_BASE_URL 환경변수/extra.AI_BASE_URL 로 덮어쓰면 됩니다.
const fallbackBase = ''; // ← 오프라인 폴백 기본값

// ---- 최종 값 조립 ----
const rawBase = (env.BASE ?? extra.AI_BASE_URL ?? fallbackBase);
export const AI_BASE_URL   = String(rawBase || '').replace(/\/+$/, ''); // 끝 슬래시 제거
export const AI_TIMEOUT_MS = toNum(env.TIMEOUT ?? extra.AI_TIMEOUT_MS, 8000); // ← 8초 기본
export const AI_MODEL      = env.MODEL ?? extra.AI_MODEL ?? 'oss-20b';
export const ENABLE_OSS20B = toBool(env.ENABLE ?? extra.ENABLE_OSS20B ?? false);
export const AI_API_KEY    = env.KEY ?? extra.AI_API_KEY ?? '';

// 도움용: 서버 사용 여부
export const HAS_SERVER = !!AI_BASE_URL;

// 선택: 인증 헤더
export function authHeaders() {
  return AI_API_KEY ? { Authorization: `Bearer ${AI_API_KEY}` } : {};
}
