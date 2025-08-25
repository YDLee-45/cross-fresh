// src/services/ai/index.js

// 점수 계산은 그대로 재-export
export { aiMatchScore } from './matchScorer';

// --- 번역 어댑터 (둘 다 지원: translateText(text, 'ja') / aiTranslate(text, {to:'ja'}) ) ---
import * as trans from './translation';
export async function aiTranslate(text, opts) {
  const fn =
    trans.aiTranslate ||
    trans.translate ||
    trans.translateText ||
    trans.default;
  if (!fn) throw new Error('translation: export를 찾을 수 없습니다');

  const to = typeof opts === 'string' ? opts : (opts?.to ?? opts?.target ?? 'ja');

  // 1) (text, to) 시도: translateText(text, 'ja') 형태
  try {
    return await fn(text, to);
  } catch (e1) {
    // 2) (text, {to}) 시도: aiTranslate(text, { to:'ja' }) 형태
    return await fn(text, { to });
  }
}

// --- 빠른 답장 어댑터 (함수명 다양성 흡수) ---
import * as ca from './chatAssist';
export async function aiQuickReplies(prompt, options) {
  const fn =
    ca.aiQuickReplies ||
    ca.quickReplies ||
    ca.getQuickReplies ||
    ca.default;
  if (!fn) throw new Error('chatAssist: export를 찾을 수 없습니다');

  // 일반적인 시그니처 우선
  try {
    return await fn(prompt, options);
  } catch (e1) {
    // 일부 구현이 { message } 형태를 받을 수 있어 보조 시도
    try {
      return await fn({ message: prompt, ...(options || {}) });
    } catch (e2) {
      // 마지막 안전망: 빈 배열
      return [];
    }
  }
}

