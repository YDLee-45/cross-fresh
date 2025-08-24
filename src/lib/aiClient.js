// src/lib/aiClient.js
import {
  AI_BASE_URL,
  AI_MODEL,
  ENABLE_OSS20B,
  AI_TIMEOUT_MS,
  AI_API_KEY,
} from "../config/aiConfig";

// 공통: 타임아웃 래퍼
function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("AI timeout")), ms);
    promise.then((v) => {
      clearTimeout(t);
      resolve(v);
    }).catch((e) => {
      clearTimeout(t);
      reject(e);
    });
  });
}

/* ---------------------------
 *  목업 프로바이더 (연결 전용)
 * --------------------------- */
const mockProvider = {
  async translate({ text, target }) {
    return { text: `[${target}] ${text}`, provider: "mock" };
  },
  async matchScore({ user, candidate }) {
    let score = 50;
    if (user?.gender && candidate?.gender && user.gender !== candidate.gender) score += 10;
    if (user?.age && candidate?.age && Math.abs(user.age - candidate.age) <= 3) score += 5;
    if (Array.isArray(user?.tags) && Array.isArray(candidate?.tags)) {
      const inter = user.tags.filter((t) => candidate.tags.includes(t)).length;
      score += inter * 5;
    }
    return { score: Math.max(0, Math.min(100, score)), provider: "mock" };
  },
  async suggestReplies({ lastMessage }) {
    return {
      suggestions: ["테스트1", "테스트2", "테스트3"],
      provider: "mock",
    };
  },
};

/* ---------------------------
 *  실제 프로바이더 (실서버)
 * --------------------------- */
async function postJSON(path, body) {
  if (!AI_BASE_URL) throw new Error("AI_BASE_URL not set");

  const url = `${AI_BASE_URL.replace(/\/+$/,"")}/${path.replace(/^\/+/,"")}`;
  const headers = { "Content-Type": "application/json" };
  if (AI_API_KEY) headers["Authorization"] = `Bearer ${AI_API_KEY}`;

  // 🔎 로그: 호출 전
  console.log("[AI] POST", url, { model: AI_MODEL, ...body });

  const res = await withTimeout(
    fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({ model: AI_MODEL, ...body }),
    }),
    AI_TIMEOUT_MS
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    // 🔎 로그: HTTP 에러 상황
    console.log("[AI] HTTP", res.status, text);
    throw new Error(`AI HTTP ${res.status} ${text}`);
  }

  const json = await res.json().catch(() => ({}));
  return json;
}

const realProvider = {
  translate:      (p) => postJSON("/v1/translate", p),
  matchScore:     (p) => postJSON("/v1/match/score", p),
  suggestReplies: (p) => postJSON("/v1/chat/suggest", p),
};

// 런타임 선택 (설정값 채워져 있으면 실서버, 아니면 목업)
const provider = (ENABLE_OSS20B && AI_BASE_URL) ? realProvider : mockProvider;

/* ---------------------------
 *  외부로 노출되는 함수
 * --------------------------- */
export async function aiTranslate(text, target = "ja") {
  return provider.translate({ text, target }); // { text, provider }
}

export async function aiMatchScore(user, candidate) {
  return provider.matchScore({ user, candidate }); // { score, provider }
}

export async function aiSuggestReplies(lastMessage) {
  return provider.suggestReplies({ lastMessage }); // { suggestions, provider }
}
