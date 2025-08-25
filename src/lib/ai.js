// src/lib/ai.js
// 서버 호출 + 로컬 스텁 폴백 (둘 다 지원)

let AI_BASE_URL = '';
let AI_TIMEOUT_MS = 120000;
try {
  const cfg = require('@/config/aiConfig'); // 있으면 사용
  AI_BASE_URL = cfg.AI_BASE_URL ?? '';
  AI_TIMEOUT_MS = Number(cfg.AI_TIMEOUT_MS ?? AI_TIMEOUT_MS);
} catch (_) {}

const BASE = String(AI_BASE_URL || '').replace(/\/+$/, '');
const hasServer = !!BASE;

async function postJSON(url, body, { timeoutMs = 30000 } = {}) {
  const controller = new AbortController();
  const to = setTimeout(() => controller.abort('timeout'), timeoutMs);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    // RN 네트워크/타임아웃 1회 재시도(신호 없이)
    const msg = String(err?.message || err);
    const isAbort = err?.name === 'AbortError' || msg.includes('timeout');
    const isNet = msg.includes('Network request failed');
    if (isAbort || isNet) {
      const res2 = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res2.ok) throw new Error(`HTTP ${res2.status}`);
      return await res2.json();
    }
    throw err;
  } finally {
    clearTimeout(to);
  }
}

// ---- 로컬 스텁: 간단 유사도 점수 ----
function localScore(a = {}, b = {}) {
  const A = new Set(a.hobby || a.tags || []);
  const commons = (b.hobby || b.tags || []).filter((h) => A.has(h)).length;
  const ageGap = Math.abs((a.age ?? 0) - (b.age ?? 0));
  const base = 50 + commons * 20 - Math.min(ageGap, 10);
  const score = Math.max(0, Math.min(100, Math.round(base)));
  return { score };
}

export async function aiMatchScore(a, b) {
  const timeoutMs = Math.max(30000, AI_TIMEOUT_MS || 0);
  if (hasServer) {
    try {
      const out = await postJSON(`${BASE}/v1/match/score`, { a, b }, { timeoutMs });
      // 서버가 {score} 또는 숫자만 줄 수도 있으니 보강
      if (typeof out === 'number') return { score: out };
      if (out && typeof out.score === 'number') return { score: out.score };
      // 형식이 애매하면 스텁 계산
      return localScore(a, b);
    } catch (e) {
      console.warn('[aiMatchScore] server error, fallback to local:', e);
      return localScore(a, b);
    }
  }
  // 서버 미설정 → 스텁
  return localScore(a, b);
}
