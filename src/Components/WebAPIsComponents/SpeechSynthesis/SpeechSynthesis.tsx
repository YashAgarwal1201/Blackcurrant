import { useState, useEffect } from "react";
import { ApiCard, DataRow, CaveatNote, DetailSection } from "../Shared/ApiCard";

type SynthStatus = "checking" | "unsupported" | "no-voices" | "supported";

const SpeechSynthesisSupport = () => {
  const [status, setStatus] = useState<SynthStatus>("checking");
  const [voiceCount, setVoiceCount] = useState(0);

  useEffect(() => {
    if (!("speechSynthesis" in window)) {
      setStatus("unsupported");
      return;
    }

    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setVoiceCount(voices.length);
      setStatus(voices.length > 0 ? "supported" : "no-voices");
    };

    updateVoices();
    window.speechSynthesis.addEventListener("voiceschanged", updateVoices);
    // Fallback: WebKitGTK may never fire voiceschanged without a TTS backend
    const timeout = setTimeout(updateVoices, 2000);

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", updateVoices);
      clearTimeout(timeout);
    };
  }, []);

  const cardStatus =
    status === "supported"
      ? "supported"
      : status === "no-voices"
        ? "partial"
        : status === "unsupported"
          ? "unsupported"
          : undefined;

  const statusLabel =
    status === "supported"
      ? "Supported"
      : status === "no-voices"
        ? "No Voices"
        : status === "unsupported"
          ? "Not Supported"
          : undefined;

  return (
    <ApiCard
      title="Speech Synthesis"
      icon="🔊"
      status={cardStatus}
      statusLabel={statusLabel}
      mdnUrl="https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis"
      detailTitle="Speech Synthesis — Details"
      detailContent={
        <div>
          <DetailSection heading="What it does">
            <p className="text-sm text-color5/80 leading-relaxed">
              The{" "}
              <code className="text-xs bg-white/10 px-1 rounded">
                speechSynthesis
              </code>{" "}
              API converts text to spoken audio using voice engines installed on
              the device or browser. Available voices are returned by{" "}
              <code className="text-xs bg-white/10 px-1 rounded">
                getVoices()
              </code>
              .
            </p>
          </DetailSection>
          <DetailSection heading="Browser support">
            <ul className="text-sm text-color5/80 space-y-1 list-disc list-inside leading-relaxed">
              <li>
                <strong>Chrome / Edge / Brave / Vivaldi</strong> — Supported. On
                Linux, requires{" "}
                <code className="text-xs bg-white/10 px-1 rounded">
                  espeak-ng
                </code>{" "}
                or{" "}
                <code className="text-xs bg-white/10 px-1 rounded">
                  speech-dispatcher
                </code>{" "}
                for voices to load.
              </li>
              <li>
                <strong>Firefox</strong> — Supported since v49. On Linux, reads
                voices from{" "}
                <code className="text-xs bg-white/10 px-1 rounded">
                  speech-dispatcher
                </code>{" "}
                synchronously.
              </li>
              <li>
                <strong>Safari</strong> — Supported since v7.
              </li>
              <li>
                <strong>Epiphany (WebKitGTK)</strong> — API may be present but
                non-functional without a system TTS backend.
              </li>
            </ul>
          </DetailSection>
        </div>
      }
    >
      {status === "checking" && (
        <p className="text-sm text-color5/50">Checking voices…</p>
      )}
      {status === "unsupported" && (
        <DataRow
          label="API availability"
          value="Speech Synthesis is not supported in this browser"
        />
      )}
      {status === "supported" && (
        <div className="flex flex-col gap-2">
          <DataRow
            label="API availability"
            value="Speech Synthesis is available"
          />
          <DataRow
            label="Available voices"
            value={voiceCount.toLocaleString()}
          />
        </div>
      )}
      {status === "no-voices" && (
        <div className="flex flex-col gap-2">
          <DataRow
            label="API availability"
            value="API is present but no voices loaded"
          />
          <CaveatNote>
            On Linux, install <strong>espeak-ng</strong> or{" "}
            <strong>speech-dispatcher</strong> to enable voices.
          </CaveatNote>
        </div>
      )}
    </ApiCard>
  );
};

export default SpeechSynthesisSupport;
