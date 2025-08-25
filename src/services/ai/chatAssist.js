// src/services/ai/chatAssist.js
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

const STUB = ['첫 만남 반가워요! 😊', '관심사가 궁금해요!', '주말엔 뭐 하세요?'];

export async function getQuickReplies(message = '') {
  if (!hasServer) return STUB;

  try {
    const out = await postJSON(
      `${BASE}/v1/chat/quick-replies`,
      { message },
      { timeoutMs: Math.max(30000, AI_TIMEOUT_MS || 0) }
    );

    // 배열 또는 다양한 키(suggestions/choices 등) 모두 대응
    if (Array.isArray(out)) return out;
    if (Array.isArray(out?.suggestions)) return out.suggestions;
    if (Array.isArray(out?.choices)) return out.choices;
    if (Array.isArray(out?.data?.suggestions)) return out.data.suggestions;

    return STUB;
  } catch (e) {
    console.warn('[getQuickReplies] server error, fallback:', e);
    return STUB;
  }
}
