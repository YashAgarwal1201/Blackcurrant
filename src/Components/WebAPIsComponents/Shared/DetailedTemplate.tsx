// src/Components/WebAPIsComponents/Shared/DetailTemplate.tsx
import { ReactNode } from "react";
import { DetailSection, CaveatNote } from "./ApiCard";

interface BrowserSupportRow {
  browser: string;
  supported: boolean | "partial";
  note?: string;
}

interface DetailTemplateProps {
  what: string;
  codeSnippet?: string;
  codeLabel?: string;
  browserSupport?: BrowserSupportRow[];
  caveat?: ReactNode;
  extra?: ReactNode;
}

// Intentionally hardcoded — these are semantic status colours (pass/fail/partial),
// not theme surfaces. They must stay legible on any dialog background.
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
      <p className="text-sm text-base-content leading-relaxed">{what}</p>
    </DetailSection>

    {/* Code snippet */}
    {codeSnippet && (
      <DetailSection heading={codeLabel ?? "Usage"}>
        {/*
         * bg-base-300 is the deepest surface in the token stack — appropriate
         * for a code block that needs to read as "inset" relative to the dialog.
         * border-neutral adds the same edge treatment as inputs/textareas.
         */}
        <pre className="text-xs text-base-content font-mono bg-base-300 border border-neutral rounded-lg p-3 leading-relaxed overflow-x-auto">
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
                className={`font-mono text-xs w-4 text-center shrink-0 ${SUPPORT_COLOR[String(supported)]}`}
              >
                {SUPPORT_ICON[String(supported)]}
              </span>
              <span className="text-base-content">{browser}</span>
              {note && (
                <span className="text-neutral-content text-xs ml-auto">
                  {note}
                </span>
              )}
            </div>
          ))}
        </div>
      </DetailSection>
    )}

    {/* Caveats */}
    {caveat && (
      <DetailSection heading="Caveats & notes">
        {typeof caveat === "string" ? (
          <CaveatNote>{caveat}</CaveatNote>
        ) : (
          caveat
        )}
      </DetailSection>
    )}

    {/* Extra sections */}
    {extra}
  </div>
);
