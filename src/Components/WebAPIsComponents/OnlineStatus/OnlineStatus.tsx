import { useState, useEffect } from "react";
import { ApiCard, DataRow, DetailSection } from "../Shared/ApiCard";

const OnlineStatus = () => {
  const [online, setOnline] = useState<boolean>(navigator.onLine);
  const [lastChanged, setLastChanged] = useState<string | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      setOnline(true);
      setLastChanged(new Date().toLocaleTimeString());
    };
    const handleOffline = () => {
      setOnline(false);
      setLastChanged(new Date().toLocaleTimeString());
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <ApiCard
      title="Online Status"
      icon="📡"
      category="network"
      isLive
      purpose="Detects whether the browser has a network connection. Use this to show offline banners, queue sync operations, or disable network-dependent features gracefully."
      status={online ? "supported" : "unsupported"}
      statusLabel={online ? "Online" : "Offline"}
      mdnUrl="https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine"
      detailTitle="Online Status — Details"
      detailContent={
        <div>
          <DetailSection heading="What this checks">
            <p className="text-sm text-color5/80 leading-relaxed">
              <code className="text-xs bg-white/10 px-1 rounded">
                navigator.onLine
              </code>{" "}
              returns{" "}
              <code className="text-xs bg-white/10 px-1 rounded">true</code> if
              the browser believes it has network access, and{" "}
              <code className="text-xs bg-white/10 px-1 rounded">false</code> if
              it is definitely offline. The{" "}
              <code className="text-xs bg-white/10 px-1 rounded">online</code>{" "}
              and{" "}
              <code className="text-xs bg-white/10 px-1 rounded">offline</code>{" "}
              window events fire when this changes.
            </p>
          </DetailSection>
          <DetailSection heading="Important caveat">
            <p className="text-sm text-color5/80 leading-relaxed">
              <strong>
                <code className="text-xs bg-white/10 px-1 rounded">true</code>{" "}
                does not mean the internet is reachable.
              </strong>{" "}
              It only means the device has a network interface active (e.g. WiFi
              connected but router has no internet). Use a fetch probe to verify
              real connectivity for critical operations.
            </p>
          </DetailSection>
          <DetailSection heading="Usage pattern">
            <pre className="text-xs text-color5/70 font-mono bg-white/5 rounded-lg p-2 leading-relaxed overflow-x-auto">
              {`window.addEventListener('offline', () => {
  showOfflineBanner();
  queuePendingSync();
});

window.addEventListener('online', () => {
  hideOfflineBanner();
  flushSyncQueue();
});`}
            </pre>
          </DetailSection>
        </div>
      }
    >
      <DataRow
        label="Network status"
        value={online ? "🟢 Connected" : "🔴 Disconnected"}
      />
      {lastChanged && <DataRow label="Last changed" value={lastChanged} />}
    </ApiCard>
  );
};

export default OnlineStatus;
