import { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { WEB_APIS_CARDS_BASE_STYLES } from "../../../Services/Constants";

const detectOs = (): string => {
  const ua = window.navigator.userAgent;

  // iPadOS MUST come before macOS:
  // iPad on modern iPadOS (13+) in Desktop Mode reports a macOS-style UA.
  // The "ontouchend" check disambiguates real Macs from iPads spoofing them.
  if (/iPad/.test(ua) || (/Mac/.test(ua) && "ontouchend" in document)) {
    return "iPadOS";
  } else if (/iPhone|iPod/.test(ua)) {
    return "iOS";
  } else if (/Windows/.test(ua)) {
    const match = ua.match(/Windows NT (\d+\.\d+)/);
    const versionMap: Record<string, string> = {
      "10.0": "Windows 10 / 11",
      "6.3": "Windows 8.1",
      "6.2": "Windows 8",
      "6.1": "Windows 7",
      "6.0": "Windows Vista",
      "5.1": "Windows XP",
    };
    return match
      ? (versionMap[match[1]] ?? `Windows (NT ${match[1]})`)
      : "Windows";
  } else if (/Android/.test(ua)) {
    const isTablet = /Tablet|Pad/.test(ua) || !/Mobile/.test(ua);
    return isTablet ? "Android (Tablet)" : "Android";
  } else if (/CrOS/.test(ua)) {
    return "Chrome OS";
  } else if (/Mac/.test(ua)) {
    return "macOS";
  } else if (/Linux/.test(ua)) {
    return "Linux";
  }

  return "Unknown OS";
};

const OsDetection = () => {
  const [osName, setOsName] = useState<string>(detectOs);

  useEffect(() => {
    // UA is static — re-run once on mount for SSR/hydration safety
    setOsName(detectOs());
  }, []);

  return (
    <Card
      className={WEB_APIS_CARDS_BASE_STYLES}
      title={<h2 className="font-heading">OS Detection</h2>}
      subTitle={<p className="font-subHeading">(based on user agent)</p>}
    >
      <p>{osName}</p>
    </Card>
  );
};

export default OsDetection;
