import { useMemo, useState } from "react";
import { diffLines, diffWords, diffChars, Change } from "diff";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";

import { ArrowLeftRight, Download } from "lucide-react";
import { triggerTextReportDownload } from "@/Services/DiffReportGenerator";
import useDiffCheckerStore, {
  TextDiffGranularity,
  TextDiffView,
} from "@/Services/Stores/diffCheckerStore";
import useToastStore from "@/Services/Stores/toastMessageStore";

const GRANULARITY_OPTIONS: { label: string; value: TextDiffGranularity }[] = [
  { label: "Lines", value: "lines" },
  { label: "Words", value: "words" },
  { label: "Chars", value: "chars" },
];

const VIEW_OPTIONS: { label: string; value: TextDiffView }[] = [
  { label: "Inline", value: "inline" },
  { label: "Split", value: "split" },
];

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

  // ✅ replace with
  const changes: Change[] = useMemo(() => {
    if (!originalText && !modifiedText) return [];
    if (granularity === "lines") return diffLines(originalText, modifiedText);
    if (granularity === "words") return diffWords(originalText, modifiedText);
    return diffChars(originalText, modifiedText);
  }, [originalText, modifiedText, granularity]);

  const stats = useMemo(() => {
    const added = changes
      .filter((c) => c.added)
      .reduce((a, c) => a + (c.count ?? 0), 0);
    const removed = changes
      .filter((c) => c.removed)
      .reduce((a, c) => a + (c.count ?? 0), 0);
    const unchanged = changes
      .filter((c) => !c.added && !c.removed)
      .reduce((a, c) => a + (c.count ?? 0), 0);
    return { added, removed, unchanged };
  }, [changes]);

  const hasDiff = changes.length > 0;
  const hasChanges = stats.added > 0 || stats.removed > 0;

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

  const handleCopyDiff = () => {
    const plain = changes
      .map((c) => {
        const prefix = c.added ? "+" : c.removed ? "-" : " ";
        return c.value
          .split("\n")
          .filter((l) => l.length > 0)
          .map((l) => `${prefix} ${l}`)
          .join("\n");
      })
      .join("\n");
    navigator.clipboard.writeText(plain);
    showToast("success", "Copied", "Diff copied to clipboard");
  };

  const renderInlineDiff = () =>
    changes.map((change, i) => {
      if (change.added)
        return (
          <span
            key={i}
            className="bg-success/15 text-success rounded-sm px-0.5"
          >
            {change.value}
          </span>
        );
      if (change.removed)
        return (
          <span
            key={i}
            className="bg-error/15 text-error line-through rounded-sm px-0.5"
          >
            {change.value}
          </span>
        );
      return (
        <span key={i} className="text-base-content">
          {change.value}
        </span>
      );
    });

  const renderSplitDiff = () => {
    const leftTokens: React.ReactNode[] = [];
    const rightTokens: React.ReactNode[] = [];

    changes.forEach((change, i) => {
      if (change.added) {
        rightTokens.push(
          <span
            key={i}
            className="bg-success/15 text-success rounded-sm px-0.5"
          >
            {change.value}
          </span>,
        );
      } else if (change.removed) {
        leftTokens.push(
          <span
            key={i}
            className="bg-error/15 text-error line-through rounded-sm px-0.5"
          >
            {change.value}
          </span>,
        );
      } else {
        leftTokens.push(
          <span key={`l-${i}`} className="text-base-content">
            {change.value}
          </span>,
        );
        rightTokens.push(
          <span key={`r-${i}`} className="text-base-content">
            {change.value}
          </span>,
        );
      }
    });

    return { leftTokens, rightTokens };
  };

  const { leftTokens, rightTokens } = renderSplitDiff();

  return (
    <div className="w-full h-full flex flex-col px-3 md:px-4 pb-3 md:pb-4 gap-3">
      {/* Controls row */}
      <div className="shrink-0 flex flex-wrap items-center gap-2">
        {/* Granularity */}
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

        {/* View (only meaningful when there's output) */}
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

        <div className="flex-1" />

        {/* Swap */}
        <Button
          type="button"
          disabled={!originalText && !modifiedText}
          aria-label="Swap inputs"
          title="Swap Original ↔ Modified"
          className="h-9 w-9 bg-transparent border border-neutral rounded-full
                     text-neutral-content
                     disabled:opacity-40 disabled:cursor-not-allowed
                     active:scale-95 transition-transform duration-100"
          onClick={handleSwap}
        >
          <ArrowLeftRight size={14} />
        </Button>

        {/* Download report */}
        <Button
          type="button"
          disabled={!hasDiff}
          aria-label="Download diff report"
          title="Download diff report"
          className="h-9 w-9 bg-transparent border border-neutral rounded-full
                     text-neutral-content
                     disabled:opacity-40 disabled:cursor-not-allowed
                     active:scale-95 transition-transform duration-100"
          onClick={() =>
            triggerTextReportDownload(originalText, modifiedText, granularity)
          }
        >
          <Download size={14} />
        </Button>

        {/* Clear */}
        <Button
          type="button"
          disabled={!originalText && !modifiedText}
          icon="pi pi-trash"
          aria-label="Clear all"
          title="Clear all"
          className="h-9 w-9 text-rose-400 bg-transparent border border-neutral rounded-full
                     disabled:opacity-40 disabled:cursor-not-allowed
                     active:scale-95 transition-transform duration-100"
          onClick={handleClear}
        />
      </div>

      {/* Mobile tab switcher */}
      <div className="md:hidden shrink-0">
        <div className="flex items-center gap-1 bg-base-200 rounded-xl p-1">
          <button
            type="button"
            onClick={() => setMobileTab("inputs")}
            className={`flex-1 h-9 rounded-lg text-sm font-semibold font-subHeading transition-colors duration-150
              ${mobileTab === "inputs" ? "bg-base-100 text-base-content shadow-sm" : "text-neutral-content"}`}
          >
            Inputs
          </button>
          <button
            type="button"
            onClick={() => setMobileTab("output")}
            className={`flex-1 h-9 rounded-lg text-sm font-semibold font-subHeading transition-colors duration-150
              ${mobileTab === "output" ? "bg-base-100 text-base-content shadow-sm" : "text-neutral-content"}`}
          >
            Result
            {hasChanges && (
              <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-primary" />
            )}
          </button>
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 min-h-0 flex flex-col gap-3">
        {/* Input panels */}
        <div
          className={`flex-col md:flex-row gap-3 min-h-0
            ${mobileTab === "inputs" ? "flex flex-1" : "hidden md:flex md:flex-[0_0_40%]"}`}
        >
          {/* Original */}
          <div className="flex-1 min-h-0 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-neutral-content font-content">
                Original
              </span>
              <span className="text-xs text-neutral-content tabular-nums font-content">
                {originalText.length}
              </span>
            </div>
            <InputTextarea
              value={originalText}
              onChange={(e) => setOriginalText(e.target.value)}
              className="w-full flex-1 min-h-0 p-4 font-content text-base-content
                         bg-base-200 border-2 border-neutral rounded-2xl
                         focus:border-primary!
                         transition-colors duration-150 resize-none"
              placeholder="Paste original content here…"
            />
          </div>

          {/* Modified */}
          <div className="flex-1 min-h-0 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-neutral-content font-content">
                Modified
              </span>
              <span className="text-xs text-neutral-content tabular-nums font-content">
                {modifiedText.length}
              </span>
            </div>
            <InputTextarea
              value={modifiedText}
              onChange={(e) => setModifiedText(e.target.value)}
              className="w-full flex-1 min-h-0 p-4 font-content text-base-content
                         bg-base-200 border-2 border-neutral rounded-2xl
                         focus:border-primary!
                         transition-colors duration-150 resize-none"
              placeholder="Paste modified content here…"
            />
          </div>
        </div>

        {/* Stats bar */}
        {hasDiff && (
          <div className="shrink-0 flex items-center gap-3 px-3 py-2 bg-base-200 rounded-xl border border-neutral">
            <span className="text-xs font-semibold text-success font-content tabular-nums">
              +{stats.added} added
            </span>
            <span className="w-px h-3 bg-neutral shrink-0" />
            <span className="text-xs font-semibold text-error font-content tabular-nums">
              -{stats.removed} removed
            </span>
            <span className="w-px h-3 bg-neutral shrink-0" />
            <span className="text-xs text-neutral-content font-content tabular-nums">
              {stats.unchanged} unchanged
            </span>
            <div className="flex-1" />
            <button
              type="button"
              disabled={!hasChanges}
              onClick={handleCopyDiff}
              className="text-xs text-neutral-content font-content
                         disabled:opacity-40 disabled:cursor-not-allowed
                         hover:text-base-content transition-colors duration-150"
            >
              Copy diff
            </button>
          </div>
        )}

        {/* Diff output */}
        <div
          className={`min-h-0 flex flex-col gap-1.5
            ${mobileTab === "output" ? "flex flex-1" : "hidden md:flex md:flex-1"}`}
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-neutral-content font-content shrink-0">
            {diffView === "inline" ? "Inline Diff" : "Split Diff"}
          </span>

          {!hasDiff ? (
            <div className="flex-1 flex items-center justify-center bg-base-200 rounded-2xl border-2 border-neutral border-dashed">
              <p className="text-sm text-neutral-content font-content">
                Diff output will appear here…
              </p>
            </div>
          ) : diffView === "inline" ? (
            <div
              className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-4
                         bg-base-300 border-2 border-neutral border-l-[3px] border-l-primary
                         rounded-2xl font-mono text-sm leading-relaxed whitespace-pre-wrap break-words"
            >
              {renderInlineDiff()}
            </div>
          ) : (
            <div className="flex-1 min-h-0 flex gap-3">
              <div
                className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-4
                           bg-base-300 border-2 border-neutral border-l-[3px] border-l-error
                           rounded-2xl font-mono text-sm leading-relaxed whitespace-pre-wrap break-words"
              >
                {leftTokens}
              </div>
              <div
                className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-4
                           bg-base-300 border-2 border-neutral border-l-[3px] border-l-success
                           rounded-2xl font-mono text-sm leading-relaxed whitespace-pre-wrap break-words"
              >
                {rightTokens}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextDiff;
