import { useState, useEffect } from "react";
import { ApiCard, DataRow, CaveatNote, DetailSection } from "../Shared/ApiCard";

const fmt = (bytes: number) => {
  if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(2)} GB`;
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(1)} MB`;
  return `${(bytes / 1e3).toFixed(0)} KB`;
};

const StorageQuota = () => {
  const [data, setData] = useState<{ usage: number; quota: number } | null>(
    null,
  );
  const [supported] = useState(
    () => "storage" in navigator && "estimate" in navigator.storage,
  );

  useEffect(() => {
    if (!supported) return;
    navigator.storage.estimate().then(({ usage = 0, quota = 0 }) => {
      setData({ usage, quota });
    });
  }, [supported]);

  const pct = data ? ((data.usage / data.quota) * 100).toFixed(1) : null;

  return (
    <ApiCard
      title="Storage Quota"
      icon="💾"
      category="browser-environment"
      purpose="Shows how much origin storage is used vs. available. Useful for warning users before writes fail silently in storage-heavy PWAs."
      status={!supported ? "unsupported" : "info"}
      statusLabel={
        !supported ? "Not Available" : pct ? `${pct}% used` : undefined
      }
      mdnUrl="https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/estimate"
      detailTitle="Storage Quota — Details"
      detailContent={
        <div>
          <DetailSection heading="What's included in 'usage'">
            <p className="text-sm text-color5/80 leading-relaxed">
              The usage figure covers all storage for this origin: IndexedDB,
              Cache API, localStorage, and Service Worker registrations. The
              quota is an estimate — browsers may grant more if storage is
              available.
            </p>
          </DetailSection>
          <DetailSection heading="Browser support">
            <p className="text-sm text-color5/80 leading-relaxed">
              Chrome 55+, Firefox 57+, Safari 15.2+. Available only in secure
              contexts (HTTPS or localhost).
            </p>
          </DetailSection>
        </div>
      }
    >
      {!supported ? (
        <CaveatNote>
          Storage Manager API is not available in this context.
        </CaveatNote>
      ) : !data ? (
        <p className="text-sm text-color5/50">Estimating…</p>
      ) : (
        <>
          <DataRow label="Used" value={fmt(data.usage)} copyable />
          <DataRow label="Quota" value={fmt(data.quota)} copyable />
          <DataRow label="Usage" value={`${pct}%`} />
        </>
      )}
    </ApiCard>
  );
};

export default StorageQuota;
