import { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { WEB_APIS_CARDS_BASE_STYLES } from "../../../Services/Constants";

type SynthStatus = "checking" | "unsupported" | "no-voices" | "supported";

const SpeechSynthesisSupport = () => {
  const [status, setStatus] = useState<SynthStatus>("checking");
  const [voiceCount, setVoiceCount] = useState<number>(0);

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

    // Firefox: voices available synchronously
    // Chrome: must wait for voiceschanged event
    // WebKitGTK/Linux: may never fire if no TTS backend installed
    updateVoices();
    window.speechSynthesis.addEventListener("voiceschanged", updateVoices);

    // Fallback timeout: if voiceschanged never fires within 2s,
    // re-check — handles Epiphany/WebKitGTK where the event may not fire
    const timeout = setTimeout(updateVoices, 2000);

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", updateVoices);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <Card
      className={WEB_APIS_CARDS_BASE_STYLES}
      title={<h2 className="font-heading">Speech Synthesis Support</h2>}
      subTitle={
        <p className="font-subHeading">(browser compatibility check)</p>
      }
    >
      {status === "checking" && <p>Checking...</p>}
      {status === "unsupported" && (
        <p>Speech Synthesis is not supported in this browser.</p>
      )}
      {status === "supported" && (
        <div>
          <p>Speech Synthesis is supported in this browser.</p>
          <p>Available voices: {voiceCount}</p>
        </div>
      )}
      {status === "no-voices" && (
        <div>
          <p>Speech Synthesis API is present but no voices are available.</p>
          <p style={{ fontSize: "0.75rem", marginTop: "0.5rem", opacity: 0.8 }}>
            On Linux, a TTS backend (e.g. espeak-ng, speech-dispatcher) must be
            installed for voices to load.
          </p>
        </div>
      )}
    </Card>
  );
};

export default SpeechSynthesisSupport;
