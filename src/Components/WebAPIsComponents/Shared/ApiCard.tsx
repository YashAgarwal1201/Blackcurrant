import { ReactNode, useState } from "react";
import { Dialog } from "primereact/dialog";

export type StatusType = "supported" | "partial" | "unsupported" | "info";

interface ApiCardProps {
  title: string;
  icon: string;
  status?: StatusType;
  statusLabel?: string;
  children: ReactNode;
  detailTitle?: string;
  detailContent?: ReactNode;
  mdnUrl?: string;
  className?: string;
}

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
  unsupported: { bg: "bg-red-500/15", dot: "bg-red-400", text: "text-red-300" },
  info: { bg: "bg-blue-500/15", dot: "bg-blue-400", text: "text-blue-300" },
};

export const ApiCard = ({
  title,
  icon,
  status,
  statusLabel,
  children,
  detailTitle,
  detailContent,
  mdnUrl,
  className = "",
}: ApiCardProps) => {
  const [open, setOpen] = useState(false);
  const cfg = status ? STATUS_CONFIG[status] : null;

  return (
    <>
      <div
        className={`flex flex-col gap-3 rounded-xl p-4 bg-color2 text-color5 h-full min-h-[180px] ${className}`}
      >
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
          onHide={() => setOpen(false)}
          className="w-full max-w-lg mx-4"
          pt={{
            header: {
              className:
                "bg-color2 text-color5 border-b border-white/10 rounded-t-xl px-5 py-4",
            },
            content: {
              className: "bg-color2 text-color5 rounded-b-xl px-5 py-4",
            },
            closeButton: { className: "text-color5/60 hover:text-color5" },
          }}
        >
          {detailContent}
        </Dialog>
      )}
    </>
  );
};

export const DataRow = ({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-xs text-color5/50 uppercase tracking-wide leading-none">
      {label}
    </span>
    <span
      className={`text-sm font-medium leading-snug break-all ${mono ? "font-mono" : ""}`}
    >
      {value}
    </span>
  </div>
);

export const CaveatNote = ({ children }: { children: ReactNode }) => (
  <div className="flex gap-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-2.5 mt-1">
    <span className="text-yellow-400 shrink-0 text-xs mt-0.5">⚠</span>
    <p className="text-xs text-yellow-200/80 leading-snug">{children}</p>
  </div>
);

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
