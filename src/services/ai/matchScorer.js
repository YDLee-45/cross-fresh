// src/services/ai/matchScorer.js
// 서버 호출 + 로컬 스텁 폴백 (RN 타임아웃/네트워크 에러 1회 재시도)

import { AI_BASE_URL, AI_TIMEOUT_MS } from '@/config/aiConfig';

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
    // RN에서 흔한 Abort/네트워크 에러는 signal 없이 한 번 더 시도
    const msg = String(err?.message || err);
    const isAbort = err?.name === 'AbortError' || msg.includes('timeout');
    const isNet = msg.includes('Network request failed');

    if ((isAbort || isNet) && hasServer) {
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

// 스텁 점수 계산 (서버 없거나 실패 시)
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
  if (!hasServer) return localScore(a, b);

  try {
    const out = await postJSON(`${BASE}/v1/match/score`, { a, b }, { timeoutMs });
    if (typeof out === 'number') return { score: out };
    if (out && typeof out.score === 'number') return { score: out.score };
    return localScore(a, b);
  } catch (e) {
    console.warn('[aiMatchScore] server error → fallback:', e);
    return localScore(a, b);
  }
}
