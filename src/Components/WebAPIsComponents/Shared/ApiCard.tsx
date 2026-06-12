// src/Components/WebAPIsComponents/Shared/ApiCard.tsx
import { ReactNode, useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import type { WebApiCategory } from "../../../Services/webApiCategories";
import { WEB_API_CATEGORIES } from "../../../Services/webApiCategories";
import { X } from "lucide-react";

export type StatusType = "supported" | "partial" | "unsupported" | "info";

interface ApiCardProps {
  title: string;
  icon: string;
  status?: StatusType;
  statusLabel?: string;
  purpose?: string;
  isLive?: boolean;
  category?: WebApiCategory;
  children: ReactNode;
  detailTitle?: string;
  detailContent?: ReactNode;
  mdnUrl?: string;
  className?: string;
}

/*
 * Status badge colours.
 * These intentionally stay as hardcoded Tailwind palette values —
 * semantic tokens don't cover success/warning/danger states, and
 * these are content-level indicators (API support), not theme surfaces.
 * They need to stay legible on both light and dark card backgrounds.
 */
const STATUS_CONFIG: Record<
  StatusType,
  { bg: string; dot: string; text: string }
> = {
  supported: {
    bg: "bg-green-500/10",
    dot: "bg-green-400",
    text: "text-green-500 dark:text-green-400",
  },
  partial: {
    bg: "bg-yellow-500/10",
    dot: "bg-yellow-400",
    text: "text-yellow-500 dark:text-yellow-400",
  },
  unsupported: {
    bg: "bg-red-500/10",
    dot: "bg-red-400",
    text: "text-red-500 dark:text-red-400",
  },
  info: {
    bg: "bg-blue-500/15",
    dot: "bg-blue-400",
    text: "text-blue-500 dark:text-blue-400",
  },
};

// Live pulse indicator ──
const LiveDot = () => (
  <span
    className="inline-flex items-center gap-1 text-xs text-neutral-content font-content"
    title="Updates in real time"
    aria-label="Live data"
  >
    <span className="relative flex h-1.5 w-1.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
    </span>
    <span className="text-xs uppercase tracking-wide">Live</span>
  </span>
);

// Category chip ─────────
const CategoryChip = ({ category }: { category: WebApiCategory }) => {
  const meta = WEB_API_CATEGORIES.find((c) => c.id === category);
  if (!meta || category === "all") return null;
  return (
    <span className="inline-flex items-center gap-1 text-xs uppercase tracking-wide text-neutral-content font-content select-none">
      <span aria-hidden="true">{meta.icon}</span>
      {meta.label}
    </span>
  );
};

// Copy button ───────────
const CopyButton = ({ value }: { value: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard blocked — fail silently
    }
  };

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? "Copied" : `Copy ${value}`}
      className="ml-1 text-neutral-content/60 active:scale-90 transition-transform shrink-0"
    >
      {copied ? (
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          aria-hidden="true"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </button>
  );
};

// Main ApiCard ──────────
export const ApiCard = ({
  title,
  icon,
  status,
  statusLabel,
  purpose,
  isLive = false,
  category,
  children,
  detailTitle,
  detailContent,
  mdnUrl,
  className = "",
}: ApiCardProps) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const cfg = status ? STATUS_CONFIG[status] : null;

  return (
    <>
      {/*
       * Card surface: bg-base-200 (one step above the page bg-base-100).
       * border-neutral gives the card a subtle edge in both light and dark.
       * Matches the elevation language used across the rest of the app
       * (number inputs, dropdowns, textareas all use bg-base-200 + border-neutral).
       */}
      <div
        className={`flex flex-col gap-3 rounded-xl p-4 bg-base-200 border border-neutral text-base-content h-full min-h-[180px] ${className}`}
      >
        {/* Category + Live row */}
        {(category || isLive) && (
          <div className="flex items-center justify-between gap-2 -mb-1">
            {category ? <CategoryChip category={category} /> : <span />}
            {isLive && <LiveDot />}
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-lg shrink-0" aria-hidden="true">
              {icon}
            </span>
            <h3 className="font-heading text-base font-semibold leading-tight text-base-content">
              {title}
            </h3>
          </div>
          {cfg && statusLabel && (
            <span
              className={`shrink-0 inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
              {statusLabel}
            </span>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 flex flex-col gap-2 text-sm">{children}</div>

        {/* Purpose line */}
        {purpose && (
          <p className="data-row-purpose text-xs text-neutral-content leading-snug border-t border-neutral/30 pt-2">
            {purpose}
          </p>
        )}

        {/* Footer */}
        {(mdnUrl || detailContent) && (
          <div className="flex items-center gap-3 mt-auto pt-2 border-t border-neutral/30 flex-wrap">
            {mdnUrl && (
              <a
                href={mdnUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-neutral-content flex items-center gap-1 active:opacity-70 transition-opacity"
              >
                MDN Docs <span aria-hidden="true">↗</span>
              </a>
            )}
            {detailContent && (
              <button
                ref={triggerRef}
                onClick={() => setOpen(true)}
                className="text-xs text-neutral-content flex items-center gap-1 ml-auto active:opacity-70 transition-opacity cursor-pointer"
              >
                More Details <span aria-hidden="true">›</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Detail dialog */}
      {detailContent && (
        <Dialog
          header={
            <span className="font-heading text-base-content text-lg">
              {detailTitle ?? title}
            </span>
          }
          visible={open}
          onHide={() => {
            setOpen(false);
            setTimeout(() => triggerRef.current?.focus(), 0);
          }}
          className="absolute! bottom-0! sm:bottom-auto! w-full max-w-md bg-base-200 rounded-3xl!"
          headerClassName="bg-transparent! font-heading"
          contentClassName="bg-transparent! font-content"
          closeIcon={<X size={20} className="text-base-content" />}
          draggable={false}
          resizable={false}
          dismissableMask
        >
          {detailContent}
        </Dialog>
      )}
    </>
  );
};

// DataRow
export const DataRow = ({ label, value, mono = false, copyable = false }) => (
  <div className="data-row flex flex-col gap-0.5">
    <span className="data-row-label text-xs text-neutral-content uppercase tracking-wide leading-none font-content">
      {label}
    </span>
    <span
      className={`data-row-value text-sm font-medium leading-snug break-all flex items-center gap-1 text-base-content ${mono ? "font-mono" : ""}`}
    >
      <span>{value}</span>
      {copyable && typeof value === "string" && <CopyButton value={value} />}
    </span>
  </div>
);

// CaveatNote
// Intentionally keeps hardcoded yellow — this is a warning indicator,
// not a theme surface. Must stay legible on any card background.
export const CaveatNote = ({ children }: { children: ReactNode }) => (
  <div className="flex gap-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-2.5 mt-1">
    <span className="text-yellow-600 dark:text-yellow-400 shrink-0 text-xs mt-0.5">
      ⚠
    </span>
    <p className="text-xs text-yellow-600 dark:text-yellow-200 leading-snug">
      {children}
    </p>
  </div>
);

// DetailSection ─────────
export const DetailSection = ({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) => (
  <div className="mb-4 last:mb-0">
    <h3 className="text-xs uppercase tracking-widest text-neutral-content mb-2 font-semibold font-content">
      {heading}
    </h3>
    {children}
  </div>
);
