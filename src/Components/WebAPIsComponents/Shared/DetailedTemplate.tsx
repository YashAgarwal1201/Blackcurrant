// src/Components/WebAPIsComponents/Shared/DetailTemplate.tsx

import { ReactNode } from "react";
import { DetailSection, CaveatNote } from "./ApiCard";

interface BrowserSupportRow {
  browser: string;
  supported: boolean | "partial";
  note?: string;
}

interface DetailTemplateProps {
  /** Plain-English explanation of what the API does. */
  what: string;
  /** Optional code snippet string — shown in a <pre> block. */
  codeSnippet?: string;
  /** Optional label above the snippet, e.g. "Detecting on load" */
  codeLabel?: string;
  /** Browser support matrix rows. */
  browserSupport?: BrowserSupportRow[];
  /** Any caveats, quirks, or privacy notes. */
  caveat?: ReactNode;
  /** Extra sections beyond the standard four — append at the end. */
  extra?: ReactNode;
}

const SUPPORT_ICON: Record<string, string> = {
  true: "✓",
  false: "✗",
  partial: "~",
};

const SUPPORT_COLOR: Record<string, string> = {
  true: "text-green-400",
  false: "text-red-400",
  partial: "text-yellow-400",
};

export const DetailTemplate = ({
  what,
  codeSnippet,
  codeLabel,
  browserSupport,
  caveat,
  extra,
}: DetailTemplateProps) => (
  <div>
    {/* What it is */}
    <DetailSection heading="What it is">
      <p className="text-sm text-color5/80 leading-relaxed">{what}</p>
    </DetailSection>

    {/* Code snippet */}
    {codeSnippet && (
      <DetailSection heading={codeLabel ?? "Usage"}>
        <pre className="text-xs text-color5/70 font-mono bg-white/5 rounded-lg p-2 leading-relaxed overflow-x-auto">
          {codeSnippet.trim()}
        </pre>
      </DetailSection>
    )}

    {/* Browser support table */}
    {browserSupport && browserSupport.length > 0 && (
      <DetailSection heading="Browser support">
        <div className="flex flex-col gap-1">
          {browserSupport.map(({ browser, supported, note }) => (
            <div key={browser} className="flex items-center gap-2 text-sm">
              <span
                className={`font-mono text-xs w-4 text-center shrink-0 ${
                  SUPPORT_COLOR[String(supported)]
                }`}
              >
                {SUPPORT_ICON[String(supported)]}
              </span>
              <span className="text-color5/80">{browser}</span>
              {note && (
                <span className="text-color5/40 text-xs ml-auto">{note}</span>
              )}
            </div>
          ))}
        </div>
      </DetailSection>
    )}

    {/* Caveat / notes */}
    {caveat && (
      <DetailSection heading="Caveats & notes">
        {typeof caveat === "string" ? (
          <CaveatNote>{caveat}</CaveatNote>
        ) : (
          caveat
        )}
      </DetailSection>
    )}

    {/* Any extra sections */}
    {extra}
  </div>
);
