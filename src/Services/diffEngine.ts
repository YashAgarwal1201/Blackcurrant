// src/Services/diffEngine.ts
import { diffLines, diffChars, diffWords, Change } from "diff";
import type { TextDiffGranularity } from "./Stores/diffCheckerStore";

// ─── types ────────────────────────────────────────────────────────────────────

export type RowType = "unchanged" | "modified" | "added" | "removed";

/** A token within a line with char-level highlighting (for modified lines) */
export interface CharToken {
  text: string;
  type: "unchanged" | "added" | "removed";
}

/** One display row — used for BOTH inline and split views */
export interface DiffRow {
  type: RowType;
  // left side (original)
  leftLineNum: number | null;
  leftTokens: CharToken[]; // char-highlighted tokens; single token for unchanged/added/removed
  // right side (modified)
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

/**
 * For a "modified" row pair (oldLine, newLine), run diffChars to produce
 * char-level token arrays for each side.
 */
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

/**
 * Group a flat Change[] (from diffLines) into hunks.
 * Each hunk is a consecutive block of removes and/or adds.
 * Unchanged changes are emitted individually.
 *
 * Returns an array of either:
 *   { kind: "unchanged", lines: string[] }
 *   { kind: "hunk", removes: string[], adds: string[] }
 */
type Hunk =
  | { kind: "unchanged"; lines: string[] }
  | { kind: "hunk"; removes: string[]; adds: string[] };

function groupIntoHunks(changes: Change[]): Hunk[] {
  const hunks: Hunk[] = [];
  let i = 0;

  while (i < changes.length) {
    const c = changes[i];

    if (!c.added && !c.removed) {
      // unchanged block — split into individual lines
      const lines = c.value.split("\n");
      // trailing \n produces empty last element — remove it
      if (lines[lines.length - 1] === "") lines.pop();
      if (lines.length > 0) hunks.push({ kind: "unchanged", lines });
      i++;
      continue;
    }

    // collect a contiguous run of removes and adds
    const removes: string[] = [];
    const adds: string[] = [];

    while (i < changes.length && (changes[i].added || changes[i].removed)) {
      const ch = changes[i];
      const lines = ch.value.split("\n");
      if (lines[lines.length - 1] === "") lines.pop();
      if (ch.removed) removes.push(...lines);
      else adds.push(...lines);
      i++;
    }

    hunks.push({ kind: "hunk", removes, adds });
  }

  return hunks;
}

/**
 * Convert hunks → DiffRow[].
 * Modified pairs are detected by zipping removes+adds within each hunk.
 */
function hunksToRows(hunks: Hunk[]): { rows: DiffRow[]; stats: DiffStats } {
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

    // pair removes and adds into modified rows
    const pairCount = Math.min(hunk.removes.length, hunk.adds.length);

    for (let j = 0; j < pairCount; j++) {
      const { left, right } = charDiff(hunk.removes[j], hunk.adds[j]);
      rows.push({
        type: "modified",
        leftLineNum: leftNum++,
        leftTokens: left,
        rightLineNum: rightNum++,
        rightTokens: right,
      });
      stats.modified++;
    }

    // leftover removes
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

    // leftover adds
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

  if (granularity === "lines") {
    const changes = diffLines(original, modified);
    const hunks = groupIntoHunks(changes);
    return hunksToRows(hunks);
  }

  // words / chars — treat the whole text as one segment, inline token stream
  const changes: Change[] =
    granularity === "words"
      ? diffWords(original, modified)
      : diffChars(original, modified);

  // For sub-word granularity, we emit a single "synthetic" modified row
  // containing all the inline tokens — this is how Kaleidoscope / IntelliJ handle it.
  const leftTokens: CharToken[] = [];
  const rightTokens: CharToken[] = [];
  let addedCount = 0;
  let removedCount = 0;
  let unchangedCount = 0;

  for (const c of changes) {
    if (c.removed) {
      leftTokens.push({ text: c.value, type: "removed" });
      removedCount += c.count ?? 1;
    } else if (c.added) {
      rightTokens.push({ text: c.value, type: "added" });
      addedCount += c.count ?? 1;
    } else {
      leftTokens.push({ text: c.value, type: "unchanged" });
      rightTokens.push({ text: c.value, type: "unchanged" });
      unchangedCount += c.count ?? 1;
    }
  }

  return {
    rows:
      leftTokens.length > 0 || rightTokens.length > 0
        ? [
            {
              type: "modified",
              leftLineNum: null,
              leftTokens,
              rightLineNum: null,
              rightTokens,
            },
          ]
        : [],
    stats: {
      added: addedCount,
      removed: removedCount,
      modified: 0,
      unchanged: unchangedCount,
    },
  };
}

export function buildUnifiedDiffText(rows: DiffRow[]): string {
  return rows
    .map((row) => {
      const sym =
        row.type === "added"
          ? "+"
          : row.type === "removed"
            ? "-"
            : row.type === "modified"
              ? "~"
              : " ";
      const left = row.leftTokens.map((t) => t.text).join("");
      const right = row.rightTokens.map((t) => t.text).join("");
      if (row.type === "modified") return `- ${left}\n+ ${right}`;
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
