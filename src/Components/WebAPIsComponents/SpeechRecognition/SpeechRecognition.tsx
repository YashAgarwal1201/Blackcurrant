import { useState, useEffect } from "react";
import { ApiCard, DataRow, DetailSection } from "../Shared/ApiCard";

const SpeechRecognitionSupport = () => {
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    const api =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    setSupported(!!api);
  }, []);

  return (
    <ApiCard
      title="Speech Recognition"
      icon="🎤"
      category="media-sensors"
      purpose="Checks if the browser can transcribe speech to text via the Web Speech API. Chrome and Edge support it natively; Firefox does not."
      status={
        supported === null ? undefined : supported ? "supported" : "unsupported"
      }
      statusLabel={
        supported === null
          ? undefined
          : supported
            ? "Supported"
            : "Not Supported"
      }
      mdnUrl="https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition"
      detailTitle="Speech Recognition — Details"
      detailContent={
        <div>
          <DetailSection heading="What it does">
            <p className="text-sm text-color5/80 leading-relaxed">
              The Web Speech API's{" "}
              <code className="text-xs bg-white/10 px-1 rounded">
                SpeechRecognition
              </code>{" "}
              interface converts spoken audio (via the microphone) into text in
              real-time. It requires microphone permission and a network
              connection (for cloud-based recognition in Chrome).
            </p>
          </DetailSection>
          <DetailSection heading="Browser support">
            <ul className="text-sm text-color5/80 space-y-1 list-disc list-inside leading-relaxed">
              <li>
                <strong>Chrome / Brave / Edge / Vivaldi</strong> — Supported via{" "}
                <code className="text-xs bg-white/10 px-1 rounded">
                  webkitSpeechRecognition
                </code>
              </li>
              <li>
                <strong>Firefox</strong> — Not implemented (no plans as of 2026)
              </li>
              <li>
                <strong>Safari</strong> — Supported since Safari 14.1
                (macOS/iOS)
              </li>
              <li>
                <strong>Epiphany (WebKitGTK / Linux)</strong> — Not exposed even
                though engine is WebKit-based
              </li>
            </ul>
          </DetailSection>
        </div>
      }
    >
      {supported === null ? (
        <p className="text-sm text-color5/50">Checking…</p>
      ) : (
        <DataRow
          label="API availability"
          value={
            supported
              ? "SpeechRecognition is available in this browser"
              : "SpeechRecognition is not available in this browser"
          }
        />
      )}
    </ApiCard>
  );
};

export default SpeechRecognitionSupport;
