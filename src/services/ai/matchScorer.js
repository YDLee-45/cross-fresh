import { aiMatchScore } from "../../lib/aiClient";

export async function scoreCandidate(user, candidate) {
  try {
    const r = await aiMatchScore(user, candidate);
    return r.score;
  } catch {
    return 50; // 실패 시 중립 점수
  }
}
