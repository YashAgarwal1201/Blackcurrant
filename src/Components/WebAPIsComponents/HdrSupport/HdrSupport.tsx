import { useState, useEffect } from "react";
import { ApiCard, DataRow, CaveatNote, DetailSection } from "../Shared/ApiCard";

interface HdrResult {
  supported: boolean;
  viaCssQuery: boolean;
  via10Bit: boolean;
  isLinux: boolean;
}

const checkHdr = (): HdrResult => {
  const viaCssQuery =
    window.matchMedia("(dynamic-range: high)").matches ||
    window.matchMedia("(color-gamut: rec2020)").matches;
  const via10Bit = window.screen.colorDepth >= 30;
  const ua = navigator.userAgent;
  const isLinux = /Linux/.test(ua) || /X11/.test(ua);
  return { supported: viaCssQuery || via10Bit, viaCssQuery, via10Bit, isLinux };
};

const HdrSupportCheck = () => {
  const [result, setResult] = useState<HdrResult>(checkHdr);

  useEffect(() => {
    const mq = window.matchMedia("(dynamic-range: high)");
    const handleChange = () => setResult(checkHdr());
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  const showCaveat = result.isLinux && !result.supported;

  return (
    <ApiCard
      title="HDR Support"
      icon="✨"
      status={
        result.supported ? "supported" : showCaveat ? "partial" : "unsupported"
      }
      statusLabel={
        result.supported
          ? "Detected"
          : showCaveat
            ? "Uncertain"
            : "Not Detected"
      }
      mdnUrl="https://developer.mozilla.org/en-US/docs/Web/CSS/@media/dynamic-range"
      detailTitle="HDR Support — Details"
      detailContent={
        <div>
          <DetailSection heading="Detection method">
            <ul className="text-sm text-color5/80 space-y-1 list-disc list-inside leading-relaxed">
              <li>
                <strong>CSS media query</strong>:{" "}
                <code className="text-xs bg-white/10 px-1 rounded">
                  (dynamic-range: high)
                </code>{" "}
                or{" "}
                <code className="text-xs bg-white/10 px-1 rounded">
                  (color-gamut: rec2020)
                </code>
              </li>
              <li>
                <strong>Heuristic</strong>:{" "}
                <code className="text-xs bg-white/10 px-1 rounded">
                  screen.colorDepth ≥ 30
                </code>{" "}
                (10-bit = HDR-capable pipeline)
              </li>
            </ul>
          </DetailSection>
          <DetailSection heading="Linux limitation">
            <p className="text-sm text-color5/80 leading-relaxed">
              On Linux, WebKitGTK (Epiphany) and some Chromium builds defer to
              the GTK/colord colour stack rather than reading the display EDID
              directly. This means HDR-capable hardware may still report as
              unsupported. Brave/Chrome on Linux reads EDID directly and is more
              reliable.
            </p>
          </DetailSection>
          <DetailSection heading="Browser support">
            <ul className="text-sm text-color5/80 space-y-1 list-disc list-inside leading-relaxed">
              <li>
                <strong>Chrome/Edge/Brave</strong> — Supported since v98
              </li>
              <li>
                <strong>Firefox</strong> — Supported since v100
              </li>
              <li>
                <strong>Safari</strong> — Supported since v13.1
              </li>
            </ul>
          </DetailSection>
        </div>
      }
    >
      {result.supported ? (
        <div className="flex flex-col gap-2">
          <DataRow
            label="HDR status"
            value="HDR is available in this browser"
          />
          {result.via10Bit && !result.viaCssQuery && (
            <DataRow
              label="Detection method"
              value="Via 10-bit colour depth heuristic"
            />
          )}
          {result.viaCssQuery && (
            <DataRow
              label="Detection method"
              value="Via CSS dynamic-range media query"
            />
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <DataRow
            label="HDR status"
            value="HDR not detected in this browser"
          />
          {showCaveat && (
            <CaveatNote>
              On Linux, the browser may report no HDR even on capable hardware —
              the OS compositor (GTK/colord) doesn't always expose HDR metadata
              to the browser.
            </CaveatNote>
          )}
        </div>
      )}
    </ApiCard>
  );
};

export default HdrSupportCheck;
