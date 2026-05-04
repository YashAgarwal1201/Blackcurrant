import { useState, useEffect } from "react";
import { ApiCard, DataRow, DetailSection } from "../Shared/ApiCard";

const OS_ICONS: Record<string, string> = {
  "Windows 10 / 11": "🪟",
  macOS: "🍎",
  Linux: "🐧",
  Android: "🤖",
  "Android (Tablet)": "🤖",
  iOS: "📱",
  iPadOS: "📱",
  "Chrome OS": "🖥️",
};

const detectOs = (): string => {
  const ua = window.navigator.userAgent;
  if (/iPad/.test(ua) || (/Mac/.test(ua) && "ontouchend" in document))
    return "iPadOS";
  else if (/iPhone|iPod/.test(ua)) return "iOS";
  else if (/Windows/.test(ua)) {
    const m = ua.match(/Windows NT (\d+\.\d+)/);
    const map: Record<string, string> = {
      "10.0": "Windows 10 / 11",
      "6.3": "Windows 8.1",
      "6.2": "Windows 8",
      "6.1": "Windows 7",
    };
    return m ? (map[m[1]] ?? `Windows (NT ${m[1]})`) : "Windows";
  } else if (/Android/.test(ua))
    return /Tablet|Pad/.test(ua) || !/Mobile/.test(ua)
      ? "Android (Tablet)"
      : "Android";
  else if (/CrOS/.test(ua)) return "Chrome OS";
  else if (/Mac/.test(ua)) return "macOS";
  else if (/Linux/.test(ua)) return "Linux";
  return "Unknown OS";
};

const OsDetection = () => {
  const [os, setOs] = useState<string>(detectOs);

  useEffect(() => {
    setOs(detectOs());
  }, []);

  const icon = OS_ICONS[os] ?? "💻";

  return (
    <ApiCard
      title="OS Detection"
      icon="💻"
      category="browser-environment"
      purpose="Detects the host OS from the User Agent. Useful for OS-specific download links, keyboard shortcut labelling (⌘ vs Ctrl), or bug reproduction context."
      status="info"
      mdnUrl="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent"
      detailTitle="OS Detection — Details"
      detailContent={
        <div>
          <DetailSection heading="How OS is detected">
            <p className="text-sm text-color5/80 leading-relaxed">
              The OS is inferred from{" "}
              <code className="text-xs bg-white/10 px-1 rounded">
                navigator.userAgent
              </code>
              . This is not always accurate — browsers can be configured to
              spoof their UA string.
            </p>
          </DetailSection>
          <DetailSection heading="iPadOS note">
            <p className="text-sm text-color5/80 leading-relaxed">
              Since iPadOS 13, Safari in Desktop Mode sends a UA identical to
              macOS Safari. We disambiguate by checking for{" "}
              <code className="text-xs bg-white/10 px-1 rounded">
                ontouchend
              </code>{" "}
              on the document — present on iPads, absent on real Macs.
            </p>
          </DetailSection>
        </div>
      }
    >
      <div className="flex items-center gap-2">
        <span className="text-2xl" aria-hidden="true">
          {icon}
        </span>
        <DataRow label="Operating System" value={os} copyable />
      </div>
    </ApiCard>
  );
};

export default OsDetection;
