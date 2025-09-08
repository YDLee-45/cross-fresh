// src/services/ai/index.js

// --- 점수: matchScorer.js가 scoreCandidate를 export 하므로 alias로 재-export ---
export { scoreCandidate as aiMatchScore } from './matchScorer';

// --- 번역 어댑터 (translateText(text, 'ja') / aiTranslate(text, {to:'ja'}) 모두 지원) ---
import * as trans from './translation';

export async function aiTranslate(text, opts) {
  const fn =
    trans.aiTranslate ||
    trans.translate ||
    trans.translateText ||
    trans.default;

  if (typeof fn !== 'function') {
    throw new Error('translation: export를 찾을 수 없습니다');
  }

  const to = typeof opts === 'string' ? opts : (opts?.to ?? opts?.target ?? 'ja');

  // 1) (text, to)
  try {
    const out = await fn(text, to);
    return out ?? '';
  } catch {
    // 2) (text, { to })
    const out2 = await fn(text, { to });
    return out2 ?? '';
  }
}

// --- 빠른 답장 어댑터 (서버/스텁 모두 대응 + 결과 형태 정규화) ---
import * as ca from './chatAssist';

export async function aiQuickReplies(prompt = '', options = {}) {
  const fn =
    ca.aiQuickReplies ||
    ca.quickReplies ||
    ca.getQuickReplies ||
    ca.default;

  if (typeof fn !== 'function') {
    throw new Error('chatAssist: export를 찾을 수 없습니다');
  }

  // 일반 시그니처 우선
  try {
    const out = await fn(prompt, options);
    if (Array.isArray(out)) return out;
    if (Array.isArray(out?.suggestions)) return out.suggestions;
    return [];
  } catch {
    // 일부 구현이 {message} 객체를 기대하는 경우
    try {
      const out2 = await fn({ message: prompt, ...options });
      if (Array.isArray(out2)) return out2;
      if (Array.isArray(out2?.suggestions)) return out2.suggestions;
      return [];
    } catch {
      return [];
    }
  }
}
