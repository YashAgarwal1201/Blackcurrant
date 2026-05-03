import { useState, useEffect } from "react";
import { ApiCard, DataRow, DetailSection } from "../Shared/ApiCard";

interface BrowserInfo {
  name: string;
  engine: string;
  userAgent: string;
}

const detectBrowserInfo = (): BrowserInfo => {
  const ua = navigator.userAgent;

  let engine = "Unknown";
  if (/Chrome\//.test(ua) && /AppleWebKit\//.test(ua)) engine = "Blink";
  else if (/Gecko\//.test(ua) && /Firefox\//.test(ua)) engine = "Gecko";
  else if (/AppleWebKit\//.test(ua) && !/Chrome\//.test(ua)) engine = "WebKit";
  else if (/Trident\//.test(ua) || /MSIE /.test(ua)) engine = "Trident (IE)";

  let name = "Unknown Browser";
  if (/Firefox\//.test(ua)) name = "Mozilla Firefox";
  else if (/OPR\//.test(ua) || /Opera\//.test(ua)) name = "Opera";
  else if (/Edg\//.test(ua)) name = "Microsoft Edge";
  else if (/Vivaldi\//.test(ua)) name = "Vivaldi";
  else if (/SamsungBrowser\//.test(ua)) name = "Samsung Internet";
  else if (/YaBrowser\//.test(ua)) name = "Yandex Browser";
  else if ((navigator as any).brave || /Brave/.test(ua)) name = "Brave";
  else if (/Chrome\//.test(ua) && /Safari\//.test(ua)) name = "Google Chrome";
  else if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) {
    name =
      /Linux/.test(ua) || /X11/.test(ua)
        ? "GNOME Web (Epiphany)"
        : "Apple Safari";
  } else if (/Trident\//.test(ua) || /MSIE /.test(ua))
    name = "Internet Explorer";

  return { name, engine, userAgent: ua };
};

const BrowserDetection = () => {
  const [info, setInfo] = useState<BrowserInfo>(detectBrowserInfo);

  useEffect(() => {
    setInfo(detectBrowserInfo());
  }, []);

  return (
    <ApiCard
      title="Browser Detection"
      icon="🌐"
      category="browser-environment"
      purpose="Infers the browser name and rendering engine from the User Agent string. Useful for feature-gating or reproducing environment-specific bugs."
      status="info"
      mdnUrl="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent"
      detailTitle="Browser Detection — Details"
      detailContent={
        <div>
          <DetailSection heading="How detection works">
            <p className="text-sm text-color5/80 leading-relaxed">
              Browser identity is inferred from the{" "}
              <code className="text-xs bg-white/10 px-1 rounded">
                navigator.userAgent
              </code>{" "}
              string. Checks are ordered most-specific first to avoid false
              matches (e.g. Vivaldi before Chrome, Edge before Chrome).
            </p>
          </DetailSection>
          <DetailSection heading="Special cases">
            <ul className="text-sm text-color5/80 space-y-1 list-disc list-inside leading-relaxed">
              <li>
                <strong>GNOME Web / Epiphany</strong> — since v44 its UA is
                identical to Safari. Detected by OS (Linux ≠ Safari).
              </li>
              <li>
                <strong>Brave</strong> — detected via{" "}
                <code className="text-xs bg-white/10 px-1 rounded">
                  navigator.brave
                </code>{" "}
                API.
              </li>
              <li>
                <strong>Vivaldi</strong> — includes{" "}
                <code className="text-xs bg-white/10 px-1 rounded">
                  Vivaldi/
                </code>{" "}
                in UA, checked before generic Chrome.
              </li>
            </ul>
          </DetailSection>
          <DetailSection heading="Full User Agent">
            <p className="text-xs text-color5/70 font-mono break-all leading-relaxed bg-white/5 rounded-lg p-2">
              {info.userAgent}
            </p>
          </DetailSection>
        </div>
      }
    >
      <DataRow label="Browser" value={info.name} copyable />
      <DataRow label="Engine" value={info.engine} copyable />
      <div className="mt-1">
        <span className="text-xs text-color5/50 uppercase tracking-wide">
          User Agent (truncated)
        </span>
        <p className="text-xs font-mono text-color5/70 mt-0.5 line-clamp-2 break-all leading-snug">
          {info.userAgent}
        </p>
      </div>
    </ApiCard>
  );
};

export default BrowserDetection;
