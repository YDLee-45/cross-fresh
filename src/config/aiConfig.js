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

// 3) 마지막 폴백: 로컬 PC IPv4 (LAN)
const fallbackBase = 'http://192.168.219.110:5000';

// ---- 최종 값 조립 ----
const rawBase = env.BASE ?? extra.AI_BASE_URL ?? fallbackBase;
export const AI_BASE_URL   = String(rawBase || '').replace(/\/+$/, '');   // ← 끝 슬래시 제거
export const AI_TIMEOUT_MS = Number(env.TIMEOUT ?? extra.AI_TIMEOUT_MS ?? 120000);
export const AI_MODEL      = env.MODEL ?? extra.AI_MODEL ?? 'oss-20b';
export const ENABLE_OSS20B = !!(env.ENABLE ?? extra.ENABLE_OSS20B ?? false);
export const AI_API_KEY    = env.KEY ?? extra.AI_API_KEY ?? '';

// 선택: 헤더 생성기 (원하면 postJSON에 합치기)
export function authHeaders() {
  return AI_API_KEY ? { Authorization: `Bearer ${AI_API_KEY}` } : {};
}
