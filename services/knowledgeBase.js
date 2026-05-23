import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let cached = null;

export function loadKnowledgeBase() {
  if (cached) return cached;
  const kbPath = path.join(__dirname, "..", "server", "data", "grade7.json");
  const raw = fs.readFileSync(kbPath, "utf-8");
  cached = JSON.parse(raw);
  return cached;
}
