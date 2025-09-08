// src/services/ai/chatAssist.js
// 서버 호출 + 로컬 스텁 폴백 (RN 타임아웃/네트워크 에러 재시도 포함)

import { AI_BASE_URL, AI_TIMEOUT_MS } from '@/config/aiConfig';

const BASE = String(AI_BASE_URL || '').replace(/\/+$/, '');
const hasServer = !!BASE;

// 응답을 항상 string[]로 정규화
function normalizeSuggestions(out) {
  let arr = [];

  if (Array.isArray(out)) arr = out;
  else if (Array.isArray(out?.suggestions)) arr = out.suggestions;
  else if (Array.isArray(out?.choices)) arr = out.choices;
  else if (Array.isArray(out?.data?.suggestions)) arr = out.data.suggestions;
  else if (typeof out === 'string') arr = [out];

  arr = arr
    .map((it) => {
      if (typeof it === 'string') return it;
      if (!it || typeof it !== 'object') return '';
      // 서버가 객체로 보낼 수 있는 대표 키들
      return it.text ?? it.message ?? it.content ?? it.title ?? '';
    })
    .map((s) => String(s).trim())
    .filter(Boolean);

  // 중복 제거 + 길이 제한(과하면 UI 깨짐 방지)
  return [...new Set(arr)].slice(0, 8);
}

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

    // JSON 파싱이 실패할 수도 있으니 텍스트로 한 번 더 안전 처리
    try {
      return await res.json();
    } catch {
      const txt = await res.text().catch(() => '');
      if (!txt) return null;
      try {
        return JSON.parse(txt);
      } catch {
        return { text: txt };
      }
    }
  } catch (err) {
    // RN에서 흔한 Abort/네트워크 에러는 signal 없이 한 번 더 시도
    const msg = String(err?.message || err);
    const isAbort = err?.name === 'AbortError' || msg.includes('timeout');
    const isNet   = msg.includes('Network request failed');

    if ((isAbort || isNet) && hasServer) {
      const res2 = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res2.ok) throw new Error(`HTTP ${res2.status}`);
      try {
        return await res2.json();
      } catch {
        const txt2 = await res2.text().catch(() => '');
        if (!txt2) return null;
        try {
          return JSON.parse(txt2);
        } catch {
          return { text: txt2 };
        }
      }
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

    const list = normalizeSuggestions(out);
    return list.length ? list : STUB;
  } catch (e) {
    console.warn('[getQuickReplies] server error, fallback:', e);
    return STUB;
  }
}
