import { ReactNode, useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import type { WebApiCategory } from "../../../Services/webApiCategories";
import { WEB_API_CATEGORIES } from "../../../Services/webApiCategories";

// Types ───────────

export type StatusType = "supported" | "partial" | "unsupported" | "info";

interface ApiCardProps {
  title: string;
  icon: string;
  status?: StatusType;
  statusLabel?: string;
  /** One-line description of what this API does and why a developer would care. */
  purpose?: string;
  /** Mark true for cards whose values change in real time (clock, battery, orientation). */
  isLive?: boolean;
  /** The category this card belongs to — used by the filter system. */
  category?: WebApiCategory;
  children: ReactNode;
  detailTitle?: string;
  detailContent?: ReactNode;
  mdnUrl?: string;
  className?: string;
}

// Status config

const STATUS_CONFIG: Record<
  StatusType,
  { bg: string; dot: string; text: string }
> = {
  supported: {
    bg: "bg-green-500/15",
    dot: "bg-green-400",
    text: "text-green-300",
  },
  partial: {
    bg: "bg-yellow-500/15",
    dot: "bg-yellow-400",
    text: "text-yellow-300",
  },
  unsupported: {
    bg: "bg-red-500/15",
    dot: "bg-red-400",
    text: "text-red-300",
  },
  info: {
    bg: "bg-blue-500/15",
    dot: "bg-blue-400",
    text: "text-blue-300",
  },
};

// Live pulse indicator

const LiveDot = () => (
  <span
    className="inline-flex items-center gap-1 text-xs text-color5/40 font-content"
    title="Updates in real time"
    aria-label="Live data"
  >
    <span className="relative flex h-1.5 w-1.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
    </span>
    <span className="text-[10px] uppercase tracking-wide">Live</span>
  </span>
);

// Category chip

const CategoryChip = ({ category }: { category: WebApiCategory }) => {
  const meta = WEB_API_CATEGORIES.find((c) => c.id === category);
  if (!meta || category === "all") return null;
  return (
    <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wide text-color5/30 font-content select-none">
      <span aria-hidden="true">{meta.icon}</span>
      {meta.label}
    </span>
  );
};

// Copy button ──

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
      className="ml-1 text-color5/30 hover:text-color5/70 transition-colors shrink-0"
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

// Main ApiCard ─

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
      <div
        className={`flex flex-col gap-3 rounded-xl p-4 bg-color2 text-color5 h-full min-h-[180px] ${className}`}
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
            <h2 className="font-heading text-sm font-semibold leading-tight">
              {title}
            </h2>
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
          <p className="text-xs text-color5/40 leading-snug border-t border-white/5 pt-2">
            {purpose}
          </p>
        )}

        {/* Footer */}
        {(mdnUrl || detailContent) && (
          <div className="flex items-center gap-3 mt-auto pt-2 border-t border-white/10 flex-wrap">
            {mdnUrl && (
              <a
                href={mdnUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-color5/50 hover:text-color5 transition-colors flex items-center gap-1"
              >
                MDN Docs <span aria-hidden="true">↗</span>
              </a>
            )}
            {detailContent && (
              <button
                ref={triggerRef}
                onClick={() => setOpen(true)}
                className="text-xs text-color5/50 hover:text-color5 transition-colors flex items-center gap-1 ml-auto"
              >
                More Details <span aria-hidden="true">›</span>
              </button>
            )}
          </div>
        )}
      </div>

      {detailContent && (
        <Dialog
          header={detailTitle ?? title}
          visible={open}
          onHide={() => {
            setOpen(false);
            // Return focus to trigger after dialog closes
            setTimeout(() => triggerRef.current?.focus(), 0);
          }}
          className="w-full max-w-2xl mx-4"
          headerClassName="bg-color1 text-color5 rounded-t-xl"
          contentClassName="bg-color1 text-color5 rounded-b-xl"
          draggable={false}
          resizable={false}
        >
          {detailContent}
        </Dialog>
      )}
    </>
  );
};

// DataRow ──────

export const DataRow = ({
  label,
  value,
  mono = false,
  copyable = false,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
  copyable?: boolean;
}) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-xs text-color5/50 uppercase tracking-wide leading-none">
      {label}
    </span>
    <span
      className={`text-sm font-medium leading-snug break-all flex items-center gap-1 ${
        mono ? "font-mono" : ""
      }`}
    >
      <span>{value}</span>
      {copyable && typeof value === "string" && <CopyButton value={value} />}
    </span>
  </div>
);

// CaveatNote ───

export const CaveatNote = ({ children }: { children: ReactNode }) => (
  <div className="flex gap-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-2.5 mt-1">
    <span className="text-yellow-400 shrink-0 text-xs mt-0.5">⚠</span>
    <p className="text-xs text-yellow-200/80 leading-snug">{children}</p>
  </div>
);

// DetailSection

export const DetailSection = ({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) => (
  <div className="mb-4 last:mb-0">
    <h3 className="text-xs uppercase tracking-widest text-color5/50 mb-2 font-semibold">
      {heading}
    </h3>
    {children}
  </div>
);
