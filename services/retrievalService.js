import { loadKnowledgeBase } from "./knowledgeBase.js";

function tokenize(text) {
  return String(text)
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

export function retrieveContext({ subject, question, limit = 3 }) {
  const kb = loadKnowledgeBase();
  const items = kb.subjects?.[subject] ?? [];
  const tokens = new Set(tokenize(question));

  const scored = items.map((item) => {
    const itemTokens = tokenize(`${item.title} ${item.text}`);
    const score = itemTokens.reduce((acc, token) => acc + (tokens.has(token) ? 1 : 0), 0);
    return { ...item, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, limit).filter((item) => item.score > 0);

  const selected = top.length ? top : scored.slice(0, 1);
  const contextText = selected.map((item) => `- ${item.title}: ${item.text}`).join("\n");

  return {
    contextText,
    sources: selected.map(({ id, title }) => ({ id, title })),
  };
}
