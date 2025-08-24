import { aiTranslate } from "../../lib/aiClient";
export async function translateText(text, target) {
  try {
    const r = await aiTranslate(text, target);
    return r.text;
  } catch {
    return text;
  }
}
