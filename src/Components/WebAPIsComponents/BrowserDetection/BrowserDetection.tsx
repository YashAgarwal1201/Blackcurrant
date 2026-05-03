import { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { WEB_APIS_CARDS_BASE_STYLES } from "../../../Services/Constants";

interface BrowserInfo {
  name: string;
  engine: string;
  userAgent: string;
}

const detectBrowserInfo = (): BrowserInfo => {
  const ua = navigator.userAgent;

  // --- Engine detection ---
  // Blink check must come FIRST: Chrome, Edge, Opera all have both
  // "Chrome/" and "AppleWebKit/" in their UA strings.
  let engine = "Unknown";
  if (/Chrome\//.test(ua) && /AppleWebKit\//.test(ua)) {
    engine = "Blink";
  } else if (/Gecko\//.test(ua) && /Firefox\//.test(ua)) {
    engine = "Gecko";
  } else if (/AppleWebKit\//.test(ua) && !/Chrome\//.test(ua)) {
    // Pure WebKit — Safari on iOS/macOS
    engine = "WebKit";
  } else if (/Trident\//.test(ua) || /MSIE /.test(ua)) {
    engine = "Trident (IE)";
  }

  // --- Browser name detection (most-specific first) ---
  let name = "Unknown Browser";
  if (/Firefox\//.test(ua)) {
    name = "Mozilla Firefox";
  } else if (/OPR\//.test(ua) || /Opera\//.test(ua)) {
    name = "Opera";
  } else if (/Edg\//.test(ua)) {
    // Chromium Edge uses "Edg/" (not "Edge/")
    name = "Microsoft Edge";
  } else if (/SamsungBrowser\//.test(ua)) {
    name = "Samsung Internet";
  } else if (/YaBrowser\//.test(ua)) {
    name = "Yandex Browser";
  } else if ((navigator as any).brave || /Brave/.test(ua)) {
    // navigator.brave is the reliable signal; UA sniff as fallback
    name = "Brave";
  } else if (/Chrome\//.test(ua) && /Safari\//.test(ua)) {
    name = "Google Chrome";
  } else if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) {
    name = "Apple Safari";
  } else if (/Trident\//.test(ua) || /MSIE /.test(ua)) {
    name = "Internet Explorer";
  }

  return { name, engine, userAgent: ua };
};

const BrowserDetection = () => {
  const [browserInfo, setBrowserInfo] =
    useState<BrowserInfo>(detectBrowserInfo);

  useEffect(() => {
    // UA is static at runtime — re-run on mount to ensure SSR/hydration correctness
    setBrowserInfo(detectBrowserInfo());
  }, []);

  return (
    <Card
      className={WEB_APIS_CARDS_BASE_STYLES}
      title={<h2 className="font-heading">Browser Detection</h2>}
      subTitle={<p className="font-subHeading">(based on browser engine)</p>}
    >
      <p>Detected Browser: {browserInfo.name}</p>
      <p>Detected Engine: {browserInfo.engine}</p>
      <p style={{ wordBreak: "break-all", fontSize: "0.75rem" }}>
        User Agent: {browserInfo.userAgent}
      </p>
    </Card>
  );
};

export default BrowserDetection;
