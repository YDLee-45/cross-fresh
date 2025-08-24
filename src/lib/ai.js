import { AI_BASE_URL, AI_TIMEOUT_MS } from "@/config/aiConfig";

const BASE = AI_BASE_URL?.replace(/\/+$/, ""); // 끝 슬래시 제거

async function postJSON(url, body, { timeoutMs = 30000 } = {}) {
  const controller = new AbortController();
  const to = setTimeout(() => controller.abort("timeout"), timeoutMs);

  try {
    console.log("[AI] POST", url, body);
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    try {
      const data = await res.json();
      console.log("[AI] OK", data);
      return data;
    } catch (jerr) {
      console.warn("[AI] json parse fail", jerr);
      throw jerr;
    }
  } catch (err) {
    console.warn("[AI] err1", err);
    const msg = String(err?.message || err);
    const isAbort = err?.name === "AbortError" || msg.includes("timeout");
    const isNet   = msg.includes("Network request failed"); // RN 대표 에러

    if (isAbort || isNet) {
      const res2 = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(body),
      });
      if (!res2.ok) throw new Error(`HTTP ${res2.status}`);
      const data2 = await res2.json();
      console.log("[AI] retry OK", data2);
      return data2;
    }
    throw err;
  } finally {
    clearTimeout(to);
  }
}

export async function aiMatchScore(a, b) {
  const timeoutMs = Math.max(30000, AI_TIMEOUT_MS || 0);
  return postJSON(`${BASE}/v1/match/score`, { a, b }, { timeoutMs });
}
