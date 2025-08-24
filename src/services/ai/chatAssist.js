import { aiSuggestReplies } from "../../lib/aiClient";

const DEFAULT_SUGGESTIONS = [
  "첫 만남 반가워요! 😊",
  "관심사가 궁금해요!",
  "주말엔 뭐 하세요?"
];

export async function getQuickReplies(lastMessage) {
  try {
    const r = await aiSuggestReplies(lastMessage);
    const arr = Array.isArray(r?.suggestions) ? r.suggestions
              : Array.isArray(r) ? r
              : [];
    return arr.length ? arr : DEFAULT_SUGGESTIONS;
  } catch {
    return DEFAULT_SUGGESTIONS;
  }
}

