// src/Services/diffEngine.ts
import { diffLines, diffChars, diffWords, Change } from "diff";
import type { TextDiffGranularity } from "./Stores/diffCheckerStore";

// ─── types ────────────────────────────────────────────────────────────────────

export type RowType = "unchanged" | "modified" | "added" | "removed";

export interface CharToken {
  text: string;
  type: "unchanged" | "added" | "removed";
}

export interface DiffRow {
  type: RowType;
  leftLineNum: number | null;
  leftTokens: CharToken[];
  rightLineNum: number | null;
  rightTokens: CharToken[];
}

export interface DiffStats {
  added: number;
  removed: number;
  modified: number;
  unchanged: number;
}

export interface DiffResult {
  rows: DiffRow[];
  stats: DiffStats;
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function toTokens(
  text: string,
  type: "unchanged" | "added" | "removed",
): CharToken[] {
  return [{ text, type }];
}

function charDiff(
  oldLine: string,
  newLine: string,
): { left: CharToken[]; right: CharToken[] } {
  const changes = diffChars(oldLine, newLine);
  const left: CharToken[] = [];
  const right: CharToken[] = [];
  for (const c of changes) {
    if (c.removed) {
      left.push({ text: c.value, type: "removed" });
    } else if (c.added) {
      right.push({ text: c.value, type: "added" });
    } else {
      left.push({ text: c.value, type: "unchanged" });
      right.push({ text: c.value, type: "unchanged" });
    }
  }
  return { left, right };
}

function wordDiff(
  oldLine: string,
  newLine: string,
): { left: CharToken[]; right: CharToken[] } {
  const changes = diffWords(oldLine, newLine);
  const left: CharToken[] = [];
  const right: CharToken[] = [];
  for (const c of changes) {
    if (c.removed) {
      left.push({ text: c.value, type: "removed" });
    } else if (c.added) {
      right.push({ text: c.value, type: "added" });
    } else {
      left.push({ text: c.value, type: "unchanged" });
      right.push({ text: c.value, type: "unchanged" });
    }
  }
  return { left, right };
}

type Hunk =
  | { kind: "unchanged"; lines: string[] }
  | { kind: "hunk"; removes: string[]; adds: string[] };

function splitLines(value: string): string[] {
  const lines = value.split("\n");
  if (lines[lines.length - 1] === "") lines.pop();
  return lines;
}

function groupIntoHunks(changes: Change[]): Hunk[] {
  const hunks: Hunk[] = [];
  let i = 0;

  while (i < changes.length) {
    const c = changes[i];

    if (!c.added && !c.removed) {
      const lines = splitLines(c.value);
      if (lines.length > 0) hunks.push({ kind: "unchanged", lines });
      i++;
      continue;
    }

    const removes: string[] = [];
    const adds: string[] = [];

    while (i < changes.length && (changes[i].added || changes[i].removed)) {
      const ch = changes[i];
      const lines = splitLines(ch.value);
      if (ch.removed) removes.push(...lines);
      else adds.push(...lines);
      i++;
    }

    hunks.push({ kind: "hunk", removes, adds });
  }

  return hunks;
}

function hunksToRows(
  hunks: Hunk[],
  innerDiff: (
    oldLine: string,
    newLine: string,
  ) => { left: CharToken[]; right: CharToken[] },
): { rows: DiffRow[]; stats: DiffStats } {
  const rows: DiffRow[] = [];
  const stats: DiffStats = { added: 0, removed: 0, modified: 0, unchanged: 0 };
  let leftNum = 1;
  let rightNum = 1;

  for (const hunk of hunks) {
    if (hunk.kind === "unchanged") {
      for (const line of hunk.lines) {
        rows.push({
          type: "unchanged",
          leftLineNum: leftNum++,
          leftTokens: toTokens(line, "unchanged"),
          rightLineNum: rightNum++,
          rightTokens: toTokens(line, "unchanged"),
        });
        stats.unchanged++;
      }
      continue;
    }

    const pairCount = Math.min(hunk.removes.length, hunk.adds.length);

    for (let j = 0; j < pairCount; j++) {
      const { left, right } = innerDiff(hunk.removes[j], hunk.adds[j]);
      rows.push({
        type: "modified",
        leftLineNum: leftNum++,
        leftTokens: left,
        rightLineNum: rightNum++,
        rightTokens: right,
      });
      stats.modified++;
    }

    for (let j = pairCount; j < hunk.removes.length; j++) {
      rows.push({
        type: "removed",
        leftLineNum: leftNum++,
        leftTokens: toTokens(hunk.removes[j], "removed"),
        rightLineNum: null,
        rightTokens: [],
      });
      stats.removed++;
    }

    for (let j = pairCount; j < hunk.adds.length; j++) {
      rows.push({
        type: "added",
        leftLineNum: null,
        leftTokens: [],
        rightLineNum: rightNum++,
        rightTokens: toTokens(hunk.adds[j], "added"),
      });
      stats.added++;
    }
  }

  return { rows, stats };
}

// ─── token-level stat recount ─────────────────────────────────────────────────
//
// hunksToRows always counts by LINE (1 modified line, 1 added line, …).
// For words/chars granularity we want the stats bar to reflect actual
// word-count or char-count, not line-count.
//
// Strategy:
//   - Walk every row's leftTokens + rightTokens.
//   - For "modified" rows: sum up the length of removed-type tokens (left side)
//     and added-type tokens (right side) plus unchanged tokens.
//   - For "added"/"removed" rows: count the full text length.
//   - For "unchanged" rows: count the full text length.
//
// "length" means:
//   chars mode  → number of characters  (token.text.length)
//   words mode  → number of whitespace-delimited words
//
// We report removed+added rather than "modified" for sub-line granularity
// because "5 chars modified" is ambiguous — "5 removed, 5 added" is precise.

function countUnits(text: string, granularity: "words" | "chars"): number {
  if (granularity === "chars") return text.length;
  // words: split on whitespace, filter empty strings
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}

function recomputeTokenStats(
  rows: DiffRow[],
  granularity: "words" | "chars",
): DiffStats {
  const stats: DiffStats = { added: 0, removed: 0, modified: 0, unchanged: 0 };

  for (const row of rows) {
    if (row.type === "unchanged") {
      // Both sides are identical — count either side once
      for (const tk of row.leftTokens) {
        stats.unchanged += countUnits(tk.text, granularity);
      }
      continue;
    }

    if (row.type === "added") {
      for (const tk of row.rightTokens) {
        stats.added += countUnits(tk.text, granularity);
      }
      continue;
    }

    if (row.type === "removed") {
      for (const tk of row.leftTokens) {
        stats.removed += countUnits(tk.text, granularity);
      }
      continue;
    }

    // "modified" row — tokens carry "added" | "removed" | "unchanged" type
    for (const tk of row.leftTokens) {
      if (tk.type === "removed") {
        stats.removed += countUnits(tk.text, granularity);
      } else {
        // "unchanged" tokens appear on both sides of a modified row;
        // count them once here (left side) and skip right side below
        stats.unchanged += countUnits(tk.text, granularity);
      }
    }
    for (const tk of row.rightTokens) {
      if (tk.type === "added") {
        stats.added += countUnits(tk.text, granularity);
      }
      // skip "unchanged" tokens on right side — already counted on left
    }
  }

  return stats;
}

// ─── public API ───────────────────────────────────────────────────────────────

export function computeDiff(
  original: string,
  modified: string,
  granularity: TextDiffGranularity,
): DiffResult {
  if (!original && !modified)
    return {
      rows: [],
      stats: { added: 0, removed: 0, modified: 0, unchanged: 0 },
    };

  const lineChanges = diffLines(original, modified);
  const hunks = groupIntoHunks(lineChanges);
  const innerDiff = granularity === "words" ? wordDiff : charDiff;
  const { rows, stats } = hunksToRows(hunks, innerDiff);

  // For words/chars, replace line-count stats with actual token-unit counts
  const finalStats =
    granularity === "lines" ? stats : recomputeTokenStats(rows, granularity);

  return { rows, stats: finalStats };
}

export function buildUnifiedDiffText(rows: DiffRow[]): string {
  return rows
    .map((row) => {
      const left = row.leftTokens.map((t) => t.text).join("");
      const right = row.rightTokens.map((t) => t.text).join("");
      if (row.type === "modified") return `- ${left}\n+ ${right}`;
      const sym =
        row.type === "added" ? "+" : row.type === "removed" ? "-" : " ";
      return `${sym} ${left || right}`;
    })
    .join("\n");
}

export function countLabel(
  text: string,
  granularity: TextDiffGranularity,
): string {
  if (!text) return "empty";
  const chars = text.length;
  const lines = text.split("\n").length;
  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

  if (granularity === "lines")
    return `${lines} line${lines !== 1 ? "s" : ""} · ${chars} chars`;
  if (granularity === "words")
    return `${words} word${words !== 1 ? "s" : ""} · ${chars} chars`;
  return `${chars} char${chars !== 1 ? "s" : ""}`;
}
