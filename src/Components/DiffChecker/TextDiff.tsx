// // src/Components/DiffChecker/TextDiff.tsx
// import { useMemo, useState, useRef, useCallback, useEffect } from "react";
// import { Button } from "primereact/button";
// import { InputTextarea } from "primereact/inputtextarea";
// import { ArrowLeftRight, Download, ChevronUp, ChevronDown } from "lucide-react";

// import { triggerTextReportDownload } from "@/Services/DiffReportGenerator";
// import {
//   computeDiff,
//   buildUnifiedDiffText,
//   countLabel,
//   type DiffRow,
//   type CharToken,
// } from "@/Services/diffEngine";
// import useDiffCheckerStore, {
//   TextDiffGranularity,
//   TextDiffView,
// } from "@/Services/Stores/diffCheckerStore";
// import useToastStore from "@/Services/Stores/toastMessageStore";

// // ─── constants ────────────────────────────────────────────────────────────────

// const GRANULARITY_OPTIONS: { label: string; value: TextDiffGranularity }[] = [
//   { label: "Lines", value: "lines" },
//   { label: "Words", value: "words" },
//   { label: "Chars", value: "chars" },
// ];

// const VIEW_OPTIONS: { label: string; value: TextDiffView }[] = [
//   { label: "Inline", value: "inline" },
//   { label: "Split", value: "split" },
// ];

// // ─── colour helpers ───────────────────────────────────────────────────────────

// const ROW_BG: Record<string, string> = {
//   added: "bg-emerald-500/10",
//   removed: "bg-red-500/10",
//   // ── CHANGE 2: bumped from /8 → /12 so modified rows in split view are
//   //    clearly visually paired across both sides
//   modified: "bg-amber-500/12",
//   unchanged: "",
// };

// const GUTTER_CLS: Record<string, string> = {
//   added: "bg-emerald-500/20 text-emerald-400",
//   removed: "bg-red-500/20 text-red-400",
//   modified: "bg-amber-500/15 text-amber-400",
//   unchanged: "bg-base-300 text-neutral-content/50",
// };

// const SYMBOL: Record<string, string> = {
//   added: "+",
//   removed: "−",
//   modified: "~",
//   unchanged: " ",
// };

// const SYMBOL_CLS: Record<string, string> = {
//   added: "text-emerald-400 font-bold",
//   removed: "text-red-400 font-bold",
//   modified: "text-amber-400 font-bold",
//   unchanged: "text-neutral-content/30",
// };

// // ── CHANGE 1: char mode uses character-cell box treatment on highlighted tokens
// //    (Option B — only added/removed tokens get boxes, unchanged stays plain)
// //    Word mode keeps the original flowing highlight style.
// function charTokenCls(
//   type: CharToken["type"],
//   granularity: TextDiffGranularity,
// ): string {
//   if (granularity === "chars") {
//     // Each changed char rendered as a distinct keycap-style cell
//     if (type === "added")
//       return "inline-flex items-center justify-center bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-[3px] px-[2px] mx-[1px] min-w-[0.8em]";
//     if (type === "removed")
//       return "inline-flex items-center justify-center bg-red-500/30 text-red-300 border border-red-500/40 rounded-[3px] px-[2px] mx-[1px] min-w-[0.8em] line-through";
//     // unchanged in char mode — subtle spacing to maintain rhythm, no box
//     return "mx-[0.5px]";
//   }

//   // word mode — original flowing highlight style
//   if (type === "added")
//     return "bg-emerald-500/30 text-emerald-300 rounded-[2px]";
//   if (type === "removed")
//     return "bg-red-500/30 text-red-300 rounded-[2px] line-through";
//   return "";
// }

// // ─── sub-components ───────────────────────────────────────────────────────────

// const InlineRow = ({
//   row,
//   granularity,
// }: {
//   row: DiffRow;
//   granularity: TextDiffGranularity;
// }) => {
//   const rowBg = ROW_BG[row.type] ?? "";
//   const gutterCl = GUTTER_CLS[row.type] ?? "";
//   const symCl = SYMBOL_CLS[row.type] ?? "";
//   const sym = SYMBOL[row.type] ?? " ";

//   const tokens = row.leftTokens.length
//     ? row.leftTokens
//     : row.rightTokens.length
//       ? row.rightTokens
//       : [{ text: " ", type: "unchanged" as const }];

//   const lineLeft = row.leftLineNum != null ? String(row.leftLineNum) : "";
//   const lineRight = row.rightLineNum != null ? String(row.rightLineNum) : "";

//   return (
//     <div
//       className={`flex items-stretch min-w-0 ${rowBg} hover:brightness-110 transition-[filter] duration-75`}
//     >
//       <span
//         className={`shrink-0 w-10 py-0.5 text-right pr-1.5 text-xs tabular-nums select-none border-r border-base-200/50 ${gutterCl}`}
//       >
//         {lineLeft}
//       </span>
//       <span
//         className={`shrink-0 w-10 py-0.5 text-right pr-1.5 text-xs tabular-nums select-none border-r border-base-200/50 ${gutterCl}`}
//       >
//         {lineRight}
//       </span>
//       <span
//         className={`shrink-0 w-6 py-0.5 text-center text-xs select-none border-r border-base-200/50 ${gutterCl} ${symCl}`}
//       >
//         {sym}
//       </span>
//       <span className="flex-1 min-w-0 py-0.5 px-3 text-sm font-mono leading-relaxed whitespace-pre-wrap break-all">
//         {tokens.map((tk, i) => (
//           <span
//             key={i}
//             className={`${charTokenCls(tk.type, granularity)} text-base-content`}
//           >
//             {tk.text || " "}
//           </span>
//         ))}
//       </span>
//     </div>
//   );
// };

// const ModifiedInlineRow = ({
//   row,
//   granularity,
// }: {
//   row: DiffRow;
//   granularity: TextDiffGranularity;
// }) => {
//   const leftLineNum = row.leftLineNum != null ? String(row.leftLineNum) : "";
//   const rightLineNum = row.rightLineNum != null ? String(row.rightLineNum) : "";

//   return (
//     <div className="border-l-2 border-amber-500/60">
//       {/* Old line — red tint, bottom separator to pair with new line */}
//       <div className="flex items-stretch min-w-0 bg-red-500/10 border-b border-amber-500/20 hover:brightness-110 transition-[filter] duration-75">
//         <span className="shrink-0 w-10 py-0.5 text-right pr-1.5 text-xs tabular-nums select-none border-r border-base-200/50 bg-red-500/20 text-red-400">
//           {leftLineNum}
//         </span>
//         <span className="shrink-0 w-10 py-0.5 border-r border-base-200/50 bg-red-500/20" />
//         <span className="shrink-0 w-6 py-0.5 text-center text-xs select-none border-r border-base-200/50 bg-red-500/20 text-red-400 font-bold">
//           −
//         </span>
//         <span className="flex-1 min-w-0 py-0.5 px-3 text-sm font-mono leading-relaxed whitespace-pre-wrap break-all">
//           {row.leftTokens.map((tk, i) => (
//             <span
//               key={i}
//               className={`${charTokenCls(tk.type, granularity)} text-base-content`}
//             >
//               {tk.text || " "}
//             </span>
//           ))}
//         </span>
//       </div>

//       {/* New line — green tint */}
//       <div className="flex items-stretch min-w-0 bg-emerald-500/10 hover:brightness-110 transition-[filter] duration-75">
//         <span className="shrink-0 w-10 py-0.5 border-r border-base-200/50 bg-emerald-500/20" />
//         <span className="shrink-0 w-10 py-0.5 text-right pr-1.5 text-xs tabular-nums select-none border-r border-base-200/50 bg-emerald-500/20 text-emerald-400">
//           {rightLineNum}
//         </span>
//         <span className="shrink-0 w-6 py-0.5 text-center text-xs select-none border-r border-base-200/50 bg-emerald-500/20 text-emerald-400 font-bold">
//           +
//         </span>
//         <span className="flex-1 min-w-0 py-0.5 px-3 text-sm font-mono leading-relaxed whitespace-pre-wrap break-all">
//           {row.rightTokens.map((tk, i) => (
//             <span
//               key={i}
//               className={`${charTokenCls(tk.type, granularity)} text-base-content`}
//             >
//               {tk.text || " "}
//             </span>
//           ))}
//         </span>
//       </div>
//     </div>
//   );
// };

// const SplitCell = ({
//   lineNum,
//   tokens,
//   type,
//   side,
//   granularity,
// }: {
//   lineNum: number | null;
//   tokens: CharToken[];
//   type: DiffRow["type"];
//   side: "left" | "right";
//   granularity: TextDiffGranularity;
// }) => {
//   const isEmpty = tokens.length === 0;
//   const gutterCl = isEmpty
//     ? "bg-base-300/50 text-neutral-content/20"
//     : GUTTER_CLS[type];
//   const rowBg = isEmpty ? "bg-base-300/30" : ROW_BG[type];
//   const sym = isEmpty
//     ? ""
//     : side === "left" && type === "removed"
//       ? "−"
//       : side === "right" && type === "added"
//         ? "+"
//         : type === "modified"
//           ? side === "left"
//             ? "−"
//             : "+"
//           : " ";
//   const symCl =
//     type === "removed" || (type === "modified" && side === "left")
//       ? "text-red-400 font-bold"
//       : type === "added" || (type === "modified" && side === "right")
//         ? "text-emerald-400 font-bold"
//         : "text-neutral-content/30";

//   return (
//     <div
//       className={`flex items-stretch min-w-0 w-full ${rowBg} hover:brightness-110 transition-[filter] duration-75`}
//     >
//       <span
//         className={`shrink-0 w-10 py-0.5 text-right pr-1.5 text-xs tabular-nums select-none border-r border-base-200/50 ${gutterCl}`}
//       >
//         {lineNum ?? ""}
//       </span>
//       <span
//         className={`shrink-0 w-6 py-0.5 text-center text-xs select-none border-r border-base-200/50 ${gutterCl} ${symCl}`}
//       >
//         {sym}
//       </span>
//       <span className="flex-1 min-w-0 py-0.5 px-3 text-sm font-mono leading-relaxed whitespace-pre-wrap break-all text-base-content">
//         {isEmpty
//           ? null
//           : tokens.map((tk, i) => (
//               <span key={i} className={charTokenCls(tk.type, granularity)}>
//                 {tk.text || " "}
//               </span>
//             ))}
//       </span>
//     </div>
//   );
// };

// // ─── main component ───────────────────────────────────────────────────────────

// const TextDiff = () => {
//   const {
//     originalText,
//     modifiedText,
//     granularity,
//     diffView,
//     setOriginalText,
//     setModifiedText,
//     setGranularity,
//     setDiffView,
//   } = useDiffCheckerStore();

//   const showToast = useToastStore((s) => s.showToast);
//   const [mobileTab, setMobileTab] = useState<"inputs" | "output">("inputs");

//   // ── synchronized scroll ──────────────────────────────────────────────────────
//   const leftScrollRef = useRef<HTMLDivElement>(null);
//   const rightScrollRef = useRef<HTMLDivElement>(null);
//   const syncing = useRef(false);

//   const syncScroll = useCallback((source: "left" | "right") => {
//     if (syncing.current) return;
//     syncing.current = true;
//     const from =
//       source === "left" ? leftScrollRef.current : rightScrollRef.current;
//     const to =
//       source === "left" ? rightScrollRef.current : leftScrollRef.current;
//     if (from && to) to.scrollTop = from.scrollTop;
//     syncing.current = false;
//   }, []);

//   // ── change navigation ────────────────────────────────────────────────────────
//   const inlineScrollRef = useRef<HTMLDivElement>(null);
//   const [changeIdx, setChangeIdx] = useState(-1);
//   const changeRowsRef = useRef<number[]>([]);

//   // ── diff computation ─────────────────────────────────────────────────────────
//   const { rows, stats } = useMemo(
//     () => computeDiff(originalText, modifiedText, granularity),
//     [originalText, modifiedText, granularity],
//   );

//   const hasDiff = rows.length > 0;

//   // ── CHANGE 4: include stats.changed so pure case-flip diffs still show
//   //    the nav counter and mobile result dot in words/chars mode
//   const hasChanges =
//     stats.added > 0 ||
//     stats.removed > 0 ||
//     stats.modified > 0 ||
//     stats.changed > 0;

//   const inlineRows = rows;

//   useEffect(() => {
//     changeRowsRef.current = inlineRows.reduce<number[]>((acc, r, i) => {
//       if (r.type !== "unchanged") acc.push(i);
//       return acc;
//     }, []);
//     setChangeIdx(-1);
//   }, [inlineRows]);

//   const navigateChange = useCallback(
//     (dir: "prev" | "next") => {
//       const indices = changeRowsRef.current;
//       if (!indices.length || !inlineScrollRef.current) return;

//       const next =
//         dir === "next"
//           ? (changeIdx + 1) % indices.length
//           : (changeIdx - 1 + indices.length) % indices.length;

//       setChangeIdx(next);
//       const rowEls =
//         inlineScrollRef.current.querySelectorAll<HTMLElement>(
//           "[data-diff-row]",
//         );
//       rowEls[indices[next]]?.scrollIntoView({
//         block: "center",
//         behavior: "smooth",
//       });
//     },
//     [changeIdx],
//   );

//   // ── actions ──────────────────────────────────────────────────────────────────
//   const handleSwap = () => {
//     setOriginalText(modifiedText);
//     setModifiedText(originalText);
//     showToast(
//       "info",
//       "Swapped",
//       "Original and modified inputs have been swapped",
//     );
//   };

//   const handleClear = () => {
//     setOriginalText("");
//     setModifiedText("");
//     setMobileTab("inputs");
//     showToast("info", "Cleared", "All fields have been cleared");
//   };

//   const handleCopy = () => {
//     navigator.clipboard.writeText(buildUnifiedDiffText(rows));
//     showToast("success", "Copied", "Unified diff copied to clipboard");
//   };

//   const granLabel =
//     granularity === "lines"
//       ? "line"
//       : granularity === "words"
//         ? "word"
//         : "char";

//   // ── render ───────────────────────────────────────────────────────────────────
//   return (
//     <div className="w-full h-full flex flex-col px-3 md:px-4 pb-3 md:pb-4 gap-3">
//       {/* ── Controls ── */}
//       <div className="shrink-0 flex flex-wrap items-center gap-2">
//         <div className="flex items-center gap-1 bg-base-200 rounded-xl p-1">
//           {GRANULARITY_OPTIONS.map((opt) => (
//             <button
//               key={opt.value}
//               type="button"
//               onClick={() => setGranularity(opt.value)}
//               className={`h-8 px-3 rounded-lg text-xs font-semibold font-subHeading transition-colors duration-150
//                 ${
//                   granularity === opt.value
//                     ? "bg-base-100 text-base-content shadow-sm"
//                     : "text-neutral-content hover:text-base-content"
//                 }`}
//             >
//               {opt.label}
//             </button>
//           ))}
//         </div>

//         <div className="flex items-center gap-1 bg-base-200 rounded-xl p-1">
//           {VIEW_OPTIONS.map((opt) => (
//             <button
//               key={opt.value}
//               type="button"
//               onClick={() => setDiffView(opt.value)}
//               className={`h-8 px-3 rounded-lg text-xs font-semibold font-subHeading transition-colors duration-150
//                 ${
//                   diffView === opt.value
//                     ? "bg-base-100 text-base-content shadow-sm"
//                     : "text-neutral-content hover:text-base-content"
//                 }`}
//             >
//               {opt.label}
//             </button>
//           ))}
//         </div>

//         {diffView === "inline" && hasChanges && (
//           <div className="flex items-center gap-1 bg-base-200 rounded-xl p-1">
//             <button
//               type="button"
//               onClick={() => navigateChange("prev")}
//               title="Previous change"
//               className="h-8 w-8 flex items-center justify-center rounded-lg text-neutral-content hover:text-base-content transition-colors duration-150"
//             >
//               <ChevronUp size={14} />
//             </button>
//             <span className="text-xs tabular-nums text-neutral-content font-content px-1 min-w-14 text-center">
//               {changeIdx >= 0
//                 ? `${changeIdx + 1} / ${changeRowsRef.current.length}`
//                 : `${changeRowsRef.current.length} Δ`}
//             </span>
//             <button
//               type="button"
//               onClick={() => navigateChange("next")}
//               title="Next change"
//               className="h-8 w-8 flex items-center justify-center rounded-lg text-neutral-content hover:text-base-content transition-colors duration-150"
//             >
//               <ChevronDown size={14} />
//             </button>
//           </div>
//         )}

//         <div className="flex-1" />

//         <Button
//           type="button"
//           disabled={!originalText && !modifiedText}
//           aria-label="Swap inputs"
//           title="Swap Original ↔ Modified"
//           rounded
//           text
//           className="bg-transparent border border-neutral rounded-full text-neutral-content
//                      disabled:opacity-40 disabled:cursor-not-allowed"
//           onClick={handleSwap}
//         >
//           <ArrowLeftRight size={16} className="shrink-0" />
//         </Button>

//         <Button
//           type="button"
//           disabled={!hasDiff}
//           aria-label="Download diff report"
//           title="Download diff report"
//           className="shrink-0 bg-transparent border border-neutral rounded-full text-neutral-content
//                      disabled:opacity-40 disabled:cursor-not-allowed"
//           onClick={() =>
//             triggerTextReportDownload(originalText, modifiedText, granularity)
//           }
//         >
//           <Download size={16} />
//         </Button>

//         <Button
//           type="button"
//           disabled={!originalText && !modifiedText}
//           icon="pi pi-trash"
//           aria-label="Clear all"
//           title="Clear all"
//           className="shrink-0 h-9 w-9 text-red-400 bg-transparent border border-neutral rounded-full
//                      disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-transform duration-100"
//           onClick={handleClear}
//         />
//       </div>

//       {/* ── Mobile tabs ── */}
//       <div className="md:hidden shrink-0">
//         <div className="flex items-center gap-1 bg-base-200 rounded-xl p-1">
//           {(["inputs", "output"] as const).map((tab) => (
//             <button
//               key={tab}
//               type="button"
//               onClick={() => setMobileTab(tab)}
//               className={`flex-1 h-9 rounded-lg text-sm font-semibold font-subHeading transition-colors duration-150
//                 ${
//                   mobileTab === tab
//                     ? "bg-base-100 text-base-content shadow-sm"
//                     : "text-neutral-content"
//                 }`}
//             >
//               {tab === "inputs" ? (
//                 "Inputs"
//               ) : (
//                 <span className="flex items-center justify-center gap-1.5">
//                   Result
//                   {hasChanges && (
//                     <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
//                   )}
//                 </span>
//               )}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* ── Main area ── */}
//       <div className="flex-1 min-h-0 flex flex-col gap-3">
//         {/* Input panels */}
//         <div
//           className={`flex-col md:flex-row gap-3 min-h-0
//           ${
//             mobileTab === "inputs"
//               ? "flex flex-1"
//               : "hidden md:flex md:flex-[0_0_38%]"
//           }`}
//         >
//           {[
//             {
//               key: "original" as const,
//               label: "Original",
//               text: originalText,
//               onChange: setOriginalText,
//             },
//             {
//               key: "modified" as const,
//               label: "Modified",
//               text: modifiedText,
//               onChange: setModifiedText,
//             },
//           ].map(({ key, label, text, onChange }) => (
//             <div key={key} className="flex-1 min-h-0 flex flex-col gap-1.5">
//               <div className="flex items-center justify-between">
//                 <span className="text-xs font-semibold uppercase tracking-widest text-neutral-content font-content">
//                   {label}
//                 </span>
//                 <span className="text-xs text-neutral-content/70 font-content">
//                   {countLabel(text, granularity)}
//                 </span>
//               </div>
//               <InputTextarea
//                 value={text}
//                 onChange={(e) => onChange(e.target.value)}
//                 className="w-full flex-1 min-h-0 p-4 font-mono text-sm text-base-content
//                            bg-base-200 border-2 border-neutral rounded-2xl
//                            focus:border-primary! transition-colors duration-150 resize-none"
//                 placeholder={`Paste ${label.toLowerCase()} content here…`}
//               />
//             </div>
//           ))}
//         </div>

//         {/* ── Stats bar ── */}
//         {hasDiff && (
//           <div className="shrink-0 flex flex-wrap items-center gap-x-4 gap-y-1.5 px-3 py-2 bg-base-200 rounded-xl border border-neutral">
//             {/* lines mode: modified line count */}
//             {granularity === "lines" && stats.modified > 0 && (
//               <span className="flex items-center gap-1.5 text-xs font-semibold font-content tabular-nums text-amber-400">
//                 <span className="w-2 h-2 rounded-sm bg-amber-500/60 shrink-0" />
//                 {stats.modified} {granLabel}
//                 {stats.modified !== 1 ? "s" : ""} modified
//               </span>
//             )}
//             {/* ── CHANGE 3: words/chars mode — show "changed" for in-place modifications */}
//             {granularity !== "lines" && stats.changed > 0 && (
//               <span className="flex items-center gap-1.5 text-xs font-semibold font-content tabular-nums text-amber-400">
//                 <span className="w-2 h-2 rounded-sm bg-amber-500/60 shrink-0" />
//                 ~{stats.changed} {granLabel}
//                 {stats.changed !== 1 ? "s" : ""} changed
//               </span>
//             )}
//             {stats.added > 0 && (
//               <span className="flex items-center gap-1.5 text-xs font-semibold font-content tabular-nums text-emerald-400">
//                 <span className="w-2 h-2 rounded-sm bg-emerald-500/60 shrink-0" />
//                 +{stats.added} {granLabel}
//                 {stats.added !== 1 ? "s" : ""} added
//               </span>
//             )}
//             {stats.removed > 0 && (
//               <span className="flex items-center gap-1.5 text-xs font-semibold font-content tabular-nums text-red-400">
//                 <span className="w-2 h-2 rounded-sm bg-red-500/60 shrink-0" />−
//                 {stats.removed} {granLabel}
//                 {stats.removed !== 1 ? "s" : ""} removed
//               </span>
//             )}
//             <span className="flex items-center gap-1.5 text-xs text-neutral-content font-content tabular-nums">
//               <span className="w-2 h-2 rounded-sm bg-neutral-content/20 shrink-0" />
//               {stats.unchanged} {granLabel}
//               {stats.unchanged !== 1 ? "s" : ""} unchanged
//             </span>
//             <div className="flex-1" />
//             <button
//               type="button"
//               disabled={!hasChanges}
//               onClick={handleCopy}
//               className="text-xs text-neutral-content font-content disabled:opacity-40 disabled:cursor-not-allowed hover:text-base-content transition-colors duration-150"
//             >
//               Copy diff
//             </button>
//           </div>
//         )}

//         {/* ── Diff output ── */}
//         <div
//           className={`min-h-0 flex flex-col gap-1.5
//           ${mobileTab === "output" ? "flex flex-1" : "hidden md:flex md:flex-1"}`}
//         >
//           <div className="shrink-0 flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <span className="text-xs font-semibold uppercase tracking-widest text-neutral-content font-content">
//                 {diffView === "inline" ? "Inline Diff" : "Split Diff"}
//               </span>
//               {granularity !== "lines" && (
//                 <span className="text-xs text-neutral-content/50 font-content">
//                   · {granularity === "words" ? "word-level" : "character-level"}
//                 </span>
//               )}
//             </div>
//             <div className="flex items-center gap-3 text-xs text-neutral-content font-content">
//               <span className="flex items-center gap-1">
//                 <span className="w-2 h-2 rounded-sm bg-emerald-500/50" />
//                 added
//               </span>
//               <span className="flex items-center gap-1">
//                 <span className="w-2 h-2 rounded-sm bg-red-500/50" />
//                 removed
//               </span>
//               <span className="flex items-center gap-1">
//                 <span className="w-2 h-2 rounded-sm bg-amber-500/50" />
//                 modified
//               </span>
//             </div>
//           </div>

//           {!hasDiff ? (
//             <div className="flex-1 flex items-center justify-center bg-base-200 rounded-2xl border-2 border-dashed border-neutral">
//               <p className="text-sm text-neutral-content font-content">
//                 Diff output will appear here…
//               </p>
//             </div>
//           ) : diffView === "inline" ? (
//             /* ══ INLINE VIEW ══ */
//             <div className="flex-1 min-h-0 rounded-2xl border border-neutral overflow-hidden flex flex-col bg-base-300">
//               <div className="shrink-0 flex items-stretch bg-base-200 border-b border-neutral text-xs text-neutral-content/60 font-content select-none">
//                 <span className="shrink-0 w-10 py-1.5 text-right pr-1.5 border-r border-base-200/50 bg-base-200">
//                   Orig
//                 </span>
//                 <span className="shrink-0 w-10 py-1.5 text-right pr-1.5 border-r border-base-200/50 bg-base-200">
//                   Mod
//                 </span>
//                 <span className="shrink-0 w-6 py-1.5 text-center border-r border-base-200/50 bg-base-200" />
//                 <span className="flex-1 py-1.5 px-3">Content</span>
//               </div>
//               <div
//                 ref={inlineScrollRef}
//                 className="flex-1 min-h-0 overflow-y-auto overflow-x-auto custom-scrollbar"
//               >
//                 {inlineRows.map((row, i) => (
//                   <div key={i} data-diff-row>
//                     {row.type === "modified" ? (
//                       <ModifiedInlineRow row={row} granularity={granularity} />
//                     ) : (
//                       <InlineRow row={row} granularity={granularity} />
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ) : (
//             /* ══ SPLIT VIEW ══ */
//             <div className="flex-1 min-h-0 flex gap-2 overflow-hidden">
//               <div className="flex-1 min-w-0 flex flex-col rounded-2xl border border-neutral overflow-hidden bg-base-300">
//                 <div className="shrink-0 flex items-center px-3 py-1.5 bg-base-200 border-b border-neutral">
//                   <span className="flex-1 text-xs font-semibold uppercase tracking-widest text-neutral-content font-content">
//                     Original
//                   </span>
//                   <span className="flex items-center gap-1 text-xs text-red-400 font-content">
//                     <span className="w-2 h-2 rounded-sm bg-red-500/50" />
//                     removed
//                   </span>
//                 </div>
//                 <div className="shrink-0 flex items-stretch bg-base-200 border-b border-neutral text-xs text-neutral-content/60 font-content select-none">
//                   <span className="shrink-0 w-10 py-1 text-right pr-1.5 border-r border-base-200/50">
//                     Line
//                   </span>
//                   <span className="shrink-0 w-6 py-1 text-center border-r border-base-200/50" />
//                   <span className="flex-1 py-1 px-3">Content</span>
//                 </div>
//                 <div
//                   ref={leftScrollRef}
//                   onScroll={() => syncScroll("left")}
//                   className="flex-1 min-h-0 overflow-y-auto overflow-x-auto custom-scrollbar"
//                 >
//                   {rows.map((row, i) => (
//                     <SplitCell
//                       key={i}
//                       lineNum={row.leftLineNum}
//                       tokens={row.leftTokens}
//                       type={row.type}
//                       side="left"
//                       granularity={granularity}
//                     />
//                   ))}
//                 </div>
//               </div>

//               <div className="flex-1 min-w-0 flex flex-col rounded-2xl border border-neutral overflow-hidden bg-base-300">
//                 <div className="shrink-0 flex items-center px-3 py-1.5 bg-base-200 border-b border-neutral">
//                   <span className="flex-1 text-xs font-semibold uppercase tracking-widest text-neutral-content font-content">
//                     Modified
//                   </span>
//                   <span className="flex items-center gap-1 text-xs text-emerald-400 font-content">
//                     <span className="w-2 h-2 rounded-sm bg-emerald-500/50" />
//                     added
//                   </span>
//                 </div>
//                 <div className="shrink-0 flex items-stretch bg-base-200 border-b border-neutral text-xs text-neutral-content/60 font-content select-none">
//                   <span className="shrink-0 w-10 py-1 text-right pr-1.5 border-r border-base-200/50">
//                     Line
//                   </span>
//                   <span className="shrink-0 w-6 py-1 text-center border-r border-base-200/50" />
//                   <span className="flex-1 py-1 px-3">Content</span>
//                 </div>
//                 <div
//                   ref={rightScrollRef}
//                   onScroll={() => syncScroll("right")}
//                   className="flex-1 min-h-0 overflow-y-auto overflow-x-auto custom-scrollbar"
//                 >
//                   {rows.map((row, i) => (
//                     <SplitCell
//                       key={i}
//                       lineNum={row.rightLineNum}
//                       tokens={row.rightTokens}
//                       type={row.type}
//                       side="right"
//                       granularity={granularity}
//                     />
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TextDiff;

// src/Components/DiffChecker/TextDiff.tsx
import { useMemo, useState, useRef, useCallback, useEffect } from "react";
import type { ReactNode } from "react";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { ArrowLeftRight, Download, ChevronUp, ChevronDown } from "lucide-react";

import { triggerTextReportDownload } from "@/Services/DiffReportGenerator";
import {
  computeDiff,
  buildUnifiedDiffText,
  countLabel,
  type DiffRow,
  type CharToken,
} from "@/Services/diffEngine";
import useDiffCheckerStore, {
  TextDiffGranularity,
  TextDiffView,
} from "@/Services/Stores/diffCheckerStore";
import useToastStore from "@/Services/Stores/toastMessageStore";

// ─── constants ────────────────────────────────────────────────────────────────

const GRANULARITY_OPTIONS: { label: string; value: TextDiffGranularity }[] = [
  { label: "Lines", value: "lines" },
  { label: "Words", value: "words" },
  { label: "Chars", value: "chars" },
];

const VIEW_OPTIONS: { label: string; value: TextDiffView }[] = [
  { label: "Inline", value: "inline" },
  { label: "Split", value: "split" },
];

// ─── colour helpers ───────────────────────────────────────────────────────────

const ROW_BG: Record<string, string> = {
  added: "bg-emerald-500/10",
  removed: "bg-red-500/10",
  modified: "bg-amber-500/12",
  unchanged: "",
};

const GUTTER_CLS: Record<string, string> = {
  added: "bg-emerald-500/20 text-emerald-400",
  removed: "bg-red-500/20 text-red-400",
  modified: "bg-amber-500/15 text-amber-400",
  unchanged: "bg-base-300 text-neutral-content/50",
};

const SYMBOL: Record<string, string> = {
  added: "+",
  removed: "−",
  modified: "~",
  unchanged: " ",
};

const SYMBOL_CLS: Record<string, string> = {
  added: "text-emerald-400 font-bold",
  removed: "text-red-400 font-bold",
  modified: "text-amber-400 font-bold",
  unchanged: "text-neutral-content/30",
};

// ─── token class helper ───────────────────────────────────────────────────────
//
// Char mode: added/removed tokens get a keycap-style bordered cell.
//            unchanged tokens get minimal spacing only — no box.
// Word mode: added/removed tokens get a flowing blob highlight (original style).

function charTokenCls(
  type: CharToken["type"],
  granularity: TextDiffGranularity,
): string {
  if (granularity === "chars") {
    if (type === "added")
      return "inline-flex items-center justify-center bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-[3px] px-[2px] mx-[1px] min-w-[0.8em]";
    if (type === "removed")
      return "inline-flex items-center justify-center bg-red-500/30 text-red-300 border border-red-500/40 rounded-[3px] px-[2px] mx-[1px] min-w-[0.8em] line-through";
    return "mx-[0.5px]";
  }

  // word mode — flowing highlight
  if (type === "added")
    return "bg-emerald-500/30 text-emerald-300 rounded-[2px]";
  if (type === "removed")
    return "bg-red-500/30 text-red-300 rounded-[2px] line-through";
  return "";
}

// ─── renderToken ──────────────────────────────────────────────────────────────
//
// FIX 1 — Per-character rendering in char mode.
//
// Previously, the diff engine returned multi-character token strings like
// "ing" or "er" as a single CharToken. In char mode these rendered as one
// keycap box [ing] instead of three individual cells [i][n][g].
//
// Fix: when granularity === "chars" and the token is added/removed, split
// tk.text into individual characters via [...tk.text] and render each as its
// own keycap span. Unchanged tokens stay as one span regardless — no box,
// just the subtle mx-[0.5px] spacing from charTokenCls.
//
// In lines/words mode every token renders as a single span (original behaviour
// unchanged).

function renderToken(
  tk: CharToken,
  i: number,
  granularity: TextDiffGranularity,
  extraCls = "text-base-content",
): ReactNode {
  if (granularity === "chars" && tk.type !== "unchanged") {
    return [...tk.text].map((char, ci) => (
      <span
        key={`${i}-${ci}`}
        className={`${charTokenCls(tk.type, granularity)} ${extraCls}`}
      >
        {char}
      </span>
    ));
  }
  return (
    <span
      key={i}
      className={`${charTokenCls(tk.type, granularity)} ${extraCls}`}
    >
      {tk.text || " "}
    </span>
  );
}

// ─── sub-components ───────────────────────────────────────────────────────────

const InlineRow = ({
  row,
  granularity,
}: {
  row: DiffRow;
  granularity: TextDiffGranularity;
}) => {
  const rowBg = ROW_BG[row.type] ?? "";
  const gutterCl = GUTTER_CLS[row.type] ?? "";
  const symCl = SYMBOL_CLS[row.type] ?? "";
  const sym = SYMBOL[row.type] ?? " ";

  const tokens = row.leftTokens.length
    ? row.leftTokens
    : row.rightTokens.length
      ? row.rightTokens
      : [{ text: " ", type: "unchanged" as const }];

  const lineLeft = row.leftLineNum != null ? String(row.leftLineNum) : "";
  const lineRight = row.rightLineNum != null ? String(row.rightLineNum) : "";

  return (
    <div
      className={`flex items-stretch min-w-0 ${rowBg} hover:brightness-110 transition-[filter] duration-75`}
    >
      <span
        className={`shrink-0 w-10 py-0.5 text-right pr-1.5 text-xs tabular-nums select-none border-r border-base-200/50 ${gutterCl}`}
      >
        {lineLeft}
      </span>
      <span
        className={`shrink-0 w-10 py-0.5 text-right pr-1.5 text-xs tabular-nums select-none border-r border-base-200/50 ${gutterCl}`}
      >
        {lineRight}
      </span>
      <span
        className={`shrink-0 w-6 py-0.5 text-center text-xs select-none border-r border-base-200/50 ${gutterCl} ${symCl}`}
      >
        {sym}
      </span>
      <span className="flex-1 min-w-0 py-0.5 px-3 text-sm font-mono leading-relaxed whitespace-pre-wrap break-all">
        {tokens.map((tk, i) => renderToken(tk, i, granularity))}
      </span>
    </div>
  );
};

// ── ModifiedInlineRow ─────────────────────────────────────────────────────────
//
// FIX 2 — Modified row gutter symbols changed from − / + to ~ on both sub-rows.
//
// Previously the old line showed − and the new line showed +, making a modified
// pair look like an independent deletion followed by an insertion (e.g. baz → BAZ
// appeared as "deleted baz, inserted BAZ" rather than "modified baz to BAZ").
//
// Fix: both sub-rows now show ~ in amber. The red/green backgrounds already
// communicate which side is old vs new — the ~ symbol makes it unambiguous that
// this is a modification, not a delete+add pair.

const ModifiedInlineRow = ({
  row,
  granularity,
}: {
  row: DiffRow;
  granularity: TextDiffGranularity;
}) => {
  const leftLineNum = row.leftLineNum != null ? String(row.leftLineNum) : "";
  const rightLineNum = row.rightLineNum != null ? String(row.rightLineNum) : "";

  return (
    <div className="border-l-2 border-amber-500/60">
      {/* Old line — red tint, bottom separator to visually pair with new line */}
      <div className="flex items-stretch min-w-0 bg-red-500/10 border-b border-amber-500/20 hover:brightness-110 transition-[filter] duration-75">
        <span className="shrink-0 w-10 py-0.5 text-right pr-1.5 text-xs tabular-nums select-none border-r border-base-200/50 bg-red-500/20 text-red-400">
          {leftLineNum}
        </span>
        <span className="shrink-0 w-10 py-0.5 border-r border-base-200/50 bg-red-500/20" />
        {/* ~ instead of − : signals modification, not deletion */}
        <span className="shrink-0 w-6 py-0.5 text-center text-xs select-none border-r border-base-200/50 bg-red-500/20 text-amber-400 font-bold">
          ~
        </span>
        <span className="flex-1 min-w-0 py-0.5 px-3 text-sm font-mono leading-relaxed whitespace-pre-wrap break-all">
          {row.leftTokens.map((tk, i) => renderToken(tk, i, granularity))}
        </span>
      </div>

      {/* New line — green tint */}
      <div className="flex items-stretch min-w-0 bg-emerald-500/10 hover:brightness-110 transition-[filter] duration-75">
        <span className="shrink-0 w-10 py-0.5 border-r border-base-200/50 bg-emerald-500/20" />
        <span className="shrink-0 w-10 py-0.5 text-right pr-1.5 text-xs tabular-nums select-none border-r border-base-200/50 bg-emerald-500/20 text-emerald-400">
          {rightLineNum}
        </span>
        {/* ~ instead of + : signals modification, not insertion */}
        <span className="shrink-0 w-6 py-0.5 text-center text-xs select-none border-r border-base-200/50 bg-emerald-500/20 text-amber-400 font-bold">
          ~
        </span>
        <span className="flex-1 min-w-0 py-0.5 px-3 text-sm font-mono leading-relaxed whitespace-pre-wrap break-all">
          {row.rightTokens.map((tk, i) => renderToken(tk, i, granularity))}
        </span>
      </div>
    </div>
  );
};

const SplitCell = ({
  lineNum,
  tokens,
  type,
  side,
  granularity,
}: {
  lineNum: number | null;
  tokens: CharToken[];
  type: DiffRow["type"];
  side: "left" | "right";
  granularity: TextDiffGranularity;
}) => {
  const isEmpty = tokens.length === 0;
  const gutterCl = isEmpty
    ? "bg-base-300/50 text-neutral-content/20"
    : GUTTER_CLS[type];
  const rowBg = isEmpty ? "bg-base-300/30" : ROW_BG[type];

  // FIX 2 (split view) — modified cells use ~ on both sides, consistent
  // with ModifiedInlineRow. Pure added/removed rows still show +/−.
  const sym = isEmpty
    ? ""
    : side === "left" && type === "removed"
      ? "−"
      : side === "right" && type === "added"
        ? "+"
        : type === "modified"
          ? "~"
          : " ";

  // Modified rows always get amber for the ~ symbol
  const symCl =
    type === "modified"
      ? "text-amber-400 font-bold"
      : type === "removed"
        ? "text-red-400 font-bold"
        : type === "added"
          ? "text-emerald-400 font-bold"
          : "text-neutral-content/30";

  return (
    <div
      className={`flex items-stretch min-w-0 w-full ${rowBg} hover:brightness-110 transition-[filter] duration-75`}
    >
      <span
        className={`shrink-0 w-10 py-0.5 text-right pr-1.5 text-xs tabular-nums select-none border-r border-base-200/50 ${gutterCl}`}
      >
        {lineNum ?? ""}
      </span>
      <span
        className={`shrink-0 w-6 py-0.5 text-center text-xs select-none border-r border-base-200/50 ${gutterCl} ${symCl}`}
      >
        {sym}
      </span>
      <span className="flex-1 min-w-0 py-0.5 px-3 text-sm font-mono leading-relaxed whitespace-pre-wrap break-all text-base-content">
        {isEmpty
          ? null
          : tokens.map((tk, i) => renderToken(tk, i, granularity, ""))}
      </span>
    </div>
  );
};

// ─── main component ───────────────────────────────────────────────────────────
// (unchanged from branch — no modifications below this line)

const TextDiff = () => {
  const {
    originalText,
    modifiedText,
    granularity,
    diffView,
    setOriginalText,
    setModifiedText,
    setGranularity,
    setDiffView,
  } = useDiffCheckerStore();

  const showToast = useToastStore((s) => s.showToast);
  const [mobileTab, setMobileTab] = useState<"inputs" | "output">("inputs");

  const leftScrollRef = useRef<HTMLDivElement>(null);
  const rightScrollRef = useRef<HTMLDivElement>(null);
  const syncing = useRef(false);

  const syncScroll = useCallback((source: "left" | "right") => {
    if (syncing.current) return;
    syncing.current = true;
    const from =
      source === "left" ? leftScrollRef.current : rightScrollRef.current;
    const to =
      source === "left" ? rightScrollRef.current : leftScrollRef.current;
    if (from && to) to.scrollTop = from.scrollTop;
    syncing.current = false;
  }, []);

  const inlineScrollRef = useRef<HTMLDivElement>(null);
  const [changeIdx, setChangeIdx] = useState(-1);
  const changeRowsRef = useRef<number[]>([]);

  const { rows, stats } = useMemo(
    () => computeDiff(originalText, modifiedText, granularity),
    [originalText, modifiedText, granularity],
  );

  const hasDiff = rows.length > 0;

  const hasChanges =
    stats.added > 0 ||
    stats.removed > 0 ||
    stats.modified > 0 ||
    stats.changed > 0;

  const inlineRows = rows;

  useEffect(() => {
    changeRowsRef.current = inlineRows.reduce<number[]>((acc, r, i) => {
      if (r.type !== "unchanged") acc.push(i);
      return acc;
    }, []);
    setChangeIdx(-1);
  }, [inlineRows]);

  const navigateChange = useCallback(
    (dir: "prev" | "next") => {
      const indices = changeRowsRef.current;
      if (!indices.length || !inlineScrollRef.current) return;

      const next =
        dir === "next"
          ? (changeIdx + 1) % indices.length
          : (changeIdx - 1 + indices.length) % indices.length;

      setChangeIdx(next);
      const rowEls =
        inlineScrollRef.current.querySelectorAll<HTMLElement>(
          "[data-diff-row]",
        );
      rowEls[indices[next]]?.scrollIntoView({
        block: "center",
        behavior: "smooth",
      });
    },
    [changeIdx],
  );

  const handleSwap = () => {
    setOriginalText(modifiedText);
    setModifiedText(originalText);
    showToast(
      "info",
      "Swapped",
      "Original and modified inputs have been swapped",
    );
  };

  const handleClear = () => {
    setOriginalText("");
    setModifiedText("");
    setMobileTab("inputs");
    showToast("info", "Cleared", "All fields have been cleared");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(buildUnifiedDiffText(rows));
    showToast("success", "Copied", "Unified diff copied to clipboard");
  };

  const granLabel =
    granularity === "lines"
      ? "line"
      : granularity === "words"
        ? "word"
        : "char";

  // ── render ───────────────────────────────────────────────────────────────────
  return (
    <div className="w-full h-full flex flex-col px-3 md:px-4 pb-3 md:pb-4 gap-3">
      {/* ── Controls ── */}
      <div className="shrink-0 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 bg-base-200 rounded-xl p-1">
          {GRANULARITY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setGranularity(opt.value)}
              className={`h-8 px-3 rounded-lg text-xs font-semibold font-subHeading transition-colors duration-150
                ${
                  granularity === opt.value
                    ? "bg-base-100 text-base-content shadow-sm"
                    : "text-neutral-content hover:text-base-content"
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-base-200 rounded-xl p-1">
          {VIEW_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setDiffView(opt.value)}
              className={`h-8 px-3 rounded-lg text-xs font-semibold font-subHeading transition-colors duration-150
                ${
                  diffView === opt.value
                    ? "bg-base-100 text-base-content shadow-sm"
                    : "text-neutral-content hover:text-base-content"
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {diffView === "inline" && hasChanges && (
          <div className="flex items-center gap-1 bg-base-200 rounded-xl p-1">
            <button
              type="button"
              onClick={() => navigateChange("prev")}
              title="Previous change"
              className="h-8 w-8 flex items-center justify-center rounded-lg text-neutral-content hover:text-base-content transition-colors duration-150"
            >
              <ChevronUp size={14} />
            </button>
            <span className="text-xs tabular-nums text-neutral-content font-content px-1 min-w-14 text-center">
              {changeIdx >= 0
                ? `${changeIdx + 1} / ${changeRowsRef.current.length}`
                : `${changeRowsRef.current.length} Δ`}
            </span>
            <button
              type="button"
              onClick={() => navigateChange("next")}
              title="Next change"
              className="h-8 w-8 flex items-center justify-center rounded-lg text-neutral-content hover:text-base-content transition-colors duration-150"
            >
              <ChevronDown size={14} />
            </button>
          </div>
        )}

        <div className="flex-1" />

        <Button
          type="button"
          disabled={!originalText && !modifiedText}
          aria-label="Swap inputs"
          title="Swap Original ↔ Modified"
          rounded
          text
          className="bg-transparent border border-neutral rounded-full text-neutral-content
                     disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={handleSwap}
        >
          <ArrowLeftRight size={16} className="shrink-0" />
        </Button>

        <Button
          type="button"
          disabled={!hasDiff}
          aria-label="Download diff report"
          title="Download diff report"
          className="shrink-0 bg-transparent border border-neutral rounded-full text-neutral-content
                     disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={() =>
            triggerTextReportDownload(originalText, modifiedText, granularity)
          }
        >
          <Download size={16} />
        </Button>

        <Button
          type="button"
          disabled={!originalText && !modifiedText}
          icon="pi pi-trash"
          aria-label="Clear all"
          title="Clear all"
          className="shrink-0 h-9 w-9 text-red-400 bg-transparent border border-neutral rounded-full
                     disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-transform duration-100"
          onClick={handleClear}
        />
      </div>

      {/* ── Mobile tabs ── */}
      <div className="md:hidden shrink-0">
        <div className="flex items-center gap-1 bg-base-200 rounded-xl p-1">
          {(["inputs", "output"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setMobileTab(tab)}
              className={`flex-1 h-9 rounded-lg text-sm font-semibold font-subHeading transition-colors duration-150
                ${
                  mobileTab === tab
                    ? "bg-base-100 text-base-content shadow-sm"
                    : "text-neutral-content"
                }`}
            >
              {tab === "inputs" ? (
                "Inputs"
              ) : (
                <span className="flex items-center justify-center gap-1.5">
                  Result
                  {hasChanges && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                  )}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main area ── */}
      <div className="flex-1 min-h-0 flex flex-col gap-3">
        {/* Input panels */}
        <div
          className={`flex-col md:flex-row gap-3 min-h-0
          ${
            mobileTab === "inputs"
              ? "flex flex-1"
              : "hidden md:flex md:flex-[0_0_38%]"
          }`}
        >
          {[
            {
              key: "original" as const,
              label: "Original",
              text: originalText,
              onChange: setOriginalText,
            },
            {
              key: "modified" as const,
              label: "Modified",
              text: modifiedText,
              onChange: setModifiedText,
            },
          ].map(({ key, label, text, onChange }) => (
            <div key={key} className="flex-1 min-h-0 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-widest text-neutral-content font-content">
                  {label}
                </span>
                <span className="text-xs text-neutral-content/70 font-content">
                  {countLabel(text, granularity)}
                </span>
              </div>
              <InputTextarea
                value={text}
                onChange={(e) => onChange(e.target.value)}
                className="w-full flex-1 min-h-0 p-4 font-mono text-sm text-base-content
                           bg-base-200 border-2 border-neutral rounded-2xl
                           focus:border-primary! transition-colors duration-150 resize-none"
                placeholder={`Paste ${label.toLowerCase()} content here…`}
              />
            </div>
          ))}
        </div>

        {/* ── Stats bar ── */}
        {hasDiff && (
          <div className="shrink-0 flex flex-wrap items-center gap-x-4 gap-y-1.5 px-3 py-2 bg-base-200 rounded-xl border border-neutral">
            {/* lines mode: modified line count */}
            {granularity === "lines" && stats.modified > 0 && (
              <span className="flex items-center gap-1.5 text-xs font-semibold font-content tabular-nums text-amber-400">
                <span className="w-2 h-2 rounded-sm bg-amber-500/60 shrink-0" />
                {stats.modified} {granLabel}
                {stats.modified !== 1 ? "s" : ""} modified
              </span>
            )}
            {/* ── CHANGE 3: words/chars mode — show "changed" for in-place modifications */}
            {granularity !== "lines" && stats.changed > 0 && (
              <span className="flex items-center gap-1.5 text-xs font-semibold font-content tabular-nums text-amber-400">
                <span className="w-2 h-2 rounded-sm bg-amber-500/60 shrink-0" />
                ~{stats.changed} {granLabel}
                {stats.changed !== 1 ? "s" : ""} changed
              </span>
            )}
            {stats.added > 0 && (
              <span className="flex items-center gap-1.5 text-xs font-semibold font-content tabular-nums text-emerald-400">
                <span className="w-2 h-2 rounded-sm bg-emerald-500/60 shrink-0" />
                +{stats.added} {granLabel}
                {stats.added !== 1 ? "s" : ""} added
              </span>
            )}
            {stats.removed > 0 && (
              <span className="flex items-center gap-1.5 text-xs font-semibold font-content tabular-nums text-red-400">
                <span className="w-2 h-2 rounded-sm bg-red-500/60 shrink-0" />−
                {stats.removed} {granLabel}
                {stats.removed !== 1 ? "s" : ""} removed
              </span>
            )}
            <span className="flex items-center gap-1.5 text-xs text-neutral-content font-content tabular-nums">
              <span className="w-2 h-2 rounded-sm bg-neutral-content/20 shrink-0" />
              {stats.unchanged} {granLabel}
              {stats.unchanged !== 1 ? "s" : ""} unchanged
            </span>
            <div className="flex-1" />
            <button
              type="button"
              disabled={!hasChanges}
              onClick={handleCopy}
              className="text-xs text-neutral-content font-content disabled:opacity-40 disabled:cursor-not-allowed hover:text-base-content transition-colors duration-150"
            >
              Copy diff
            </button>
          </div>
        )}

        {/* ── Diff output ── */}
        <div
          className={`min-h-0 flex flex-col gap-1.5
          ${mobileTab === "output" ? "flex flex-1" : "hidden md:flex md:flex-1"}`}
        >
          <div className="shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-neutral-content font-content">
                {diffView === "inline" ? "Inline Diff" : "Split Diff"}
              </span>
              {granularity !== "lines" && (
                <span className="text-xs text-neutral-content/50 font-content">
                  · {granularity === "words" ? "word-level" : "character-level"}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-neutral-content font-content">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-sm bg-emerald-500/50" />
                added
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-sm bg-red-500/50" />
                removed
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-sm bg-amber-500/50" />
                modified
              </span>
            </div>
          </div>

          {!hasDiff ? (
            <div className="flex-1 flex items-center justify-center bg-base-200 rounded-2xl border-2 border-dashed border-neutral">
              <p className="text-sm text-neutral-content font-content">
                Diff output will appear here…
              </p>
            </div>
          ) : diffView === "inline" ? (
            /* ══ INLINE VIEW ══ */
            <div className="flex-1 min-h-0 rounded-2xl border border-neutral overflow-hidden flex flex-col bg-base-300">
              <div className="shrink-0 flex items-stretch bg-base-200 border-b border-neutral text-xs text-neutral-content/60 font-content select-none">
                <span className="shrink-0 w-10 py-1.5 text-right pr-1.5 border-r border-base-200/50 bg-base-200">
                  Orig
                </span>
                <span className="shrink-0 w-10 py-1.5 text-right pr-1.5 border-r border-base-200/50 bg-base-200">
                  Mod
                </span>
                <span className="shrink-0 w-6 py-1.5 text-center border-r border-base-200/50 bg-base-200" />
                <span className="flex-1 py-1.5 px-3">Content</span>
              </div>
              <div
                ref={inlineScrollRef}
                className="flex-1 min-h-0 overflow-y-auto overflow-x-auto custom-scrollbar"
              >
                {inlineRows.map((row, i) => (
                  <div key={i} data-diff-row>
                    {row.type === "modified" ? (
                      <ModifiedInlineRow row={row} granularity={granularity} />
                    ) : (
                      <InlineRow row={row} granularity={granularity} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* ══ SPLIT VIEW ══ */
            <div className="flex-1 min-h-0 flex gap-2 overflow-hidden">
              <div className="flex-1 min-w-0 flex flex-col rounded-2xl border border-neutral overflow-hidden bg-base-300">
                <div className="shrink-0 flex items-center px-3 py-1.5 bg-base-200 border-b border-neutral">
                  <span className="flex-1 text-xs font-semibold uppercase tracking-widest text-neutral-content font-content">
                    Original
                  </span>
                  <span className="flex items-center gap-1 text-xs text-red-400 font-content">
                    <span className="w-2 h-2 rounded-sm bg-red-500/50" />
                    removed
                  </span>
                </div>
                <div className="shrink-0 flex items-stretch bg-base-200 border-b border-neutral text-xs text-neutral-content/60 font-content select-none">
                  <span className="shrink-0 w-10 py-1 text-right pr-1.5 border-r border-base-200/50">
                    Line
                  </span>
                  <span className="shrink-0 w-6 py-1 text-center border-r border-base-200/50" />
                  <span className="flex-1 py-1 px-3">Content</span>
                </div>
                <div
                  ref={leftScrollRef}
                  onScroll={() => syncScroll("left")}
                  className="flex-1 min-h-0 overflow-y-auto overflow-x-auto custom-scrollbar"
                >
                  {rows.map((row, i) => (
                    <SplitCell
                      key={i}
                      lineNum={row.leftLineNum}
                      tokens={row.leftTokens}
                      type={row.type}
                      side="left"
                      granularity={granularity}
                    />
                  ))}
                </div>
              </div>

              <div className="flex-1 min-w-0 flex flex-col rounded-2xl border border-neutral overflow-hidden bg-base-300">
                <div className="shrink-0 flex items-center px-3 py-1.5 bg-base-200 border-b border-neutral">
                  <span className="flex-1 text-xs font-semibold uppercase tracking-widest text-neutral-content font-content">
                    Modified
                  </span>
                  <span className="flex items-center gap-1 text-xs text-emerald-400 font-content">
                    <span className="w-2 h-2 rounded-sm bg-emerald-500/50" />
                    added
                  </span>
                </div>
                <div className="shrink-0 flex items-stretch bg-base-200 border-b border-neutral text-xs text-neutral-content/60 font-content select-none">
                  <span className="shrink-0 w-10 py-1 text-right pr-1.5 border-r border-base-200/50">
                    Line
                  </span>
                  <span className="shrink-0 w-6 py-1 text-center border-r border-base-200/50" />
                  <span className="flex-1 py-1 px-3">Content</span>
                </div>
                <div
                  ref={rightScrollRef}
                  onScroll={() => syncScroll("right")}
                  className="flex-1 min-h-0 overflow-y-auto overflow-x-auto custom-scrollbar"
                >
                  {rows.map((row, i) => (
                    <SplitCell
                      key={i}
                      lineNum={row.rightLineNum}
                      tokens={row.rightTokens}
                      type={row.type}
                      side="right"
                      granularity={granularity}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextDiff;
