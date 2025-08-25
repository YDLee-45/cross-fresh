// src/services/ai/translation.js
// 서버 호출 + 로컬 스텁 폴백 (RN 타임아웃/네트워크 에러 재시도 포함)

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
        headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...authHeaders() },
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

export async function translateText(text, targetLang = 'ja') {
  const fallback = `[${targetLang}] ${String(text ?? '')}`;
  if (!hasServer) return fallback;

  try {
    const out = await postJSON(
      `${BASE}/v1/translate`,
      { text, target: targetLang },
      { timeoutMs: Math.max(30000, AI_TIMEOUT_MS || 0) }
    );

    // 문자열 또는 { text } / { translated } 모두 대응
    if (typeof out === 'string') return out;
    return out?.text ?? out?.translated ?? fallback;
  } catch (e) {
    console.warn('[translateText] server error, fallback:', e);
    return fallback;
  }
}
