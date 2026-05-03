import { useState, useEffect } from "react";
import { ApiCard, DataRow, CaveatNote, DetailSection } from "../Shared/ApiCard";

interface NetInfo {
  effectiveType: string;
  downlink: number | null;
  rtt: number | null;
  saveData: boolean;
  supported: boolean;
}

const getNetInfo = (): NetInfo => {
  const conn =
    (navigator as any).connection ??
    (navigator as any).mozConnection ??
    (navigator as any).webkitConnection;

  if (!conn)
    return {
      effectiveType: "unknown",
      downlink: null,
      rtt: null,
      saveData: false,
      supported: false,
    };

  return {
    effectiveType: conn.effectiveType ?? "unknown",
    downlink: typeof conn.downlink === "number" ? conn.downlink : null,
    rtt: typeof conn.rtt === "number" ? conn.rtt : null,
    saveData: !!conn.saveData,
    supported: true,
  };
};

const EFFECTIVE_TYPE_LABELS: Record<
  string,
  { label: string; quality: "supported" | "partial" | "unsupported" | "info" }
> = {
  "4g": { label: "4G / Fast broadband", quality: "supported" },
  "3g": { label: "3G / Moderate", quality: "partial" },
  "2g": { label: "2G / Slow", quality: "unsupported" },
  "slow-2g": { label: "Very slow connection", quality: "unsupported" },
  unknown: { label: "Unknown", quality: "info" },
};

const NetworkInfo = () => {
  const [info, setInfo] = useState<NetInfo>(getNetInfo);

  useEffect(() => {
    const conn =
      (navigator as any).connection ??
      (navigator as any).mozConnection ??
      (navigator as any).webkitConnection;
    if (!conn) return;
    const handleChange = () => setInfo(getNetInfo());
    conn.addEventListener("change", handleChange);
    return () => conn.removeEventListener("change", handleChange);
  }, []);

  const typeInfo =
    EFFECTIVE_TYPE_LABELS[info.effectiveType] ??
    EFFECTIVE_TYPE_LABELS["unknown"];

  return (
    <ApiCard
      title="Network Info"
      icon="🌐"
      category="network"
      isLive
      purpose="Exposes connection speed tier and data-saver preference. Use this to serve lighter assets or disable auto-play video on slow or metered connections."
      status={!info.supported ? "unsupported" : typeInfo.quality}
      statusLabel={
        !info.supported ? "Not Available" : info.effectiveType.toUpperCase()
      }
      mdnUrl="https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation"
      detailTitle="Network Information API — Details"
      detailContent={
        <div>
          <DetailSection heading="What each field means">
            <ul className="text-sm text-color5/80 space-y-1 list-disc list-inside leading-relaxed">
              <li>
                <strong>effectiveType</strong> — inferred connection quality
                tier:{" "}
                <code className="text-xs bg-white/10 px-1 rounded">
                  slow-2g
                </code>
                , <code className="text-xs bg-white/10 px-1 rounded">2g</code>,{" "}
                <code className="text-xs bg-white/10 px-1 rounded">3g</code>,{" "}
                <code className="text-xs bg-white/10 px-1 rounded">4g</code>
              </li>
              <li>
                <strong>downlink</strong> — estimated downstream bandwidth in
                Mbps (rounded to 25kbps to prevent fingerprinting)
              </li>
              <li>
                <strong>rtt</strong> — estimated round-trip time in ms (rounded
                to 25ms)
              </li>
              <li>
                <strong>saveData</strong> — user has enabled Data Saver mode in
                their browser or OS
              </li>
            </ul>
          </DetailSection>
          <DetailSection heading="Browser support">
            <ul className="text-sm text-color5/80 space-y-1 list-disc list-inside leading-relaxed">
              <li>
                <strong>Chrome / Edge / Brave</strong> — Supported since Chrome
                61
              </li>
              <li>
                <strong>Firefox</strong> — Not implemented
              </li>
              <li>
                <strong>Safari</strong> — Not implemented
              </li>
            </ul>
          </DetailSection>
          <DetailSection heading="Adaptive loading pattern">
            <pre className="text-xs text-color5/70 font-mono bg-white/5 rounded-lg p-2 leading-relaxed overflow-x-auto">
              {`const conn = navigator.connection;
if (conn?.saveData || conn?.effectiveType === '2g') {
  // serve reduced-quality assets
  loadLowResImages();
  disableAutoPlay();
}`}
            </pre>
          </DetailSection>
        </div>
      }
    >
      {!info.supported ? (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-color5/60">
            Network Information API is not available in this browser.
          </p>
          <CaveatNote>
            This API is a Chrome/Edge-only feature. Firefox and Safari have not
            implemented it.
          </CaveatNote>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <DataRow label="Connection Type" value={typeInfo.label} />
          {info.downlink !== null && (
            <DataRow
              label="Downlink"
              value={`${info.downlink} Mbps`}
              copyable
            />
          )}
          {info.rtt !== null && (
            <DataRow
              label="Round-trip Time"
              value={`${info.rtt} ms`}
              copyable
            />
          )}
          <DataRow
            label="Data Saver"
            value={info.saveData ? "🔴 Enabled" : "🟢 Disabled"}
          />
        </div>
      )}
    </ApiCard>
  );
};

export default NetworkInfo;
