import { useState, useEffect, useRef } from "react";
import { ApiCard, DataRow, DetailSection } from "../Shared/ApiCard";

const BatteryStatus = () => {
  const [level, setLevel] = useState<number | null>(null);
  const [charging, setCharging] = useState<boolean | null>(null);
  const [supported, setSupported] = useState(true);
  const batteryRef = useRef<any>(null);

  useEffect(() => {
    if (!("getBattery" in navigator)) {
      setSupported(false);
      return;
    }

    const update = () => {
      const bat = batteryRef.current;
      if (!bat) return;
      const lvl = bat.level;
      if (typeof lvl === "number" && !isNaN(lvl)) {
        setLevel(Math.floor(lvl * 100));
        setCharging(bat.charging);
      } else {
        setSupported(false);
      }
    };

    (navigator as any)
      .getBattery()
      .then((bat: any) => {
        batteryRef.current = bat;
        update();
        bat.onlevelchange = update;
        bat.onchargingchange = update;
      })
      .catch(() => setSupported(false));

    return () => {
      const bat = batteryRef.current;
      if (bat) {
        bat.onlevelchange = null;
        bat.onchargingchange = null;
      }
    };
  }, []);

  const barWidth = level ?? 0;
  const barColor = !supported
    ? "bg-color5/20"
    : barWidth <= 15
      ? "bg-red-400"
      : barWidth <= 40
        ? "bg-yellow-400"
        : "bg-green-400";

  return (
    <ApiCard
      title="Battery Status"
      icon="🔋"
      category="device-hardware"
      isLive
      purpose="Use battery level and charging state to throttle background sync, animations, or data-heavy tasks on low-power devices."
      status={
        !supported
          ? "unsupported"
          : charging
            ? "supported"
            : level !== null && level <= 15
              ? "partial"
              : "info"
      }
      statusLabel={
        !supported ? "Not Available" : charging ? "Charging" : "On Battery"
      }
      mdnUrl="https://developer.mozilla.org/en-US/docs/Web/API/Battery_Status_API"
      detailTitle="Battery Status API — Details"
      detailContent={
        <div>
          <DetailSection heading="Browser support">
            <ul className="text-sm text-color5/80 space-y-1 list-disc list-inside leading-relaxed">
              <li>
                <strong>Chrome / Brave / Edge / Vivaldi</strong> — Supported
                (HTTPS required in newer versions)
              </li>
              <li>
                <strong>Firefox</strong> — Removed in v52 (2017) due to
                fingerprinting concerns
              </li>
              <li>
                <strong>Safari / Epiphany</strong> — Never supported
              </li>
            </ul>
          </DetailSection>
          <DetailSection heading="Why Firefox removed it">
            <p className="text-sm text-color5/80 leading-relaxed">
              The Battery API can be used as a fingerprinting vector — precise
              battery level and discharge rate can uniquely identify a device
              across sessions. Firefox intentionally removed it to protect
              privacy.
            </p>
          </DetailSection>
        </div>
      }
    >
      {!supported ? (
        <p className="text-sm text-color5/60">
          Battery Status API is not supported in this browser.
        </p>
      ) : level === null ? (
        <p className="text-sm text-color5/50">Checking battery…</p>
      ) : (
        <div className="flex flex-col gap-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-color5/50 uppercase tracking-wide">
                Battery Level
              </span>
              <span className="text-sm font-semibold">{level}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${barColor}`}
                style={{ width: `${barWidth}%` }}
              />
            </div>
          </div>
          <DataRow
            label="Status"
            value={charging ? "⚡ Charging" : "🔋 Discharging"}
          />
        </div>
      )}
    </ApiCard>
  );
};

export default BatteryStatus;
