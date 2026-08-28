import { readFileSync } from "node:fs";

const claims = JSON.parse(readFileSync(".factory/claims.json", "utf8"));
if (!Array.isArray(claims) || claims.length === 0) throw new Error(".factory/claims.json must contain claims");
const ids = new Set();
const sources = [readFileSync("tests/browser/claims.spec.ts", "utf8"), readFileSync("tests/claim-contract.test.ts", "utf8")].join("\n");
for (const claim of claims) {
  if (!claim || typeof claim.id !== "string" || typeof claim.claim !== "string" || typeof claim.where !== "string" || typeof claim.test !== "string" || typeof claim.sandbox !== "string") throw new Error("Every claim requires id, claim, where, test, and sandbox strings");
  if (ids.has(claim.id)) throw new Error(`Duplicate claim id: ${claim.id}`);
  ids.add(claim.id);
  const matches = sources.match(new RegExp(`@claim:${claim.id}`, "g")) ?? [];
  if (matches.length !== 1) throw new Error(`Expected exactly one test tagged @claim:${claim.id}; found ${matches.length}`);
}
const tagged = [...sources.matchAll(/@claim:([a-z0-9-]+)/g)].map((match) => match[1]);
for (const id of tagged) if (!ids.has(id)) throw new Error(`Tagged test has no manifest entry: ${id}`);
console.log(`claims: ${claims.length} entries, one tagged test each`);
