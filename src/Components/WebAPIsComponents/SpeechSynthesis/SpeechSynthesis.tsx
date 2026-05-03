import { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { WEB_APIS_CARDS_BASE_STYLES } from "../../../Services/Constants";

const SpeechSynthesisSupport = () => {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [voiceCount, setVoiceCount] = useState<number>(0);

  useEffect(() => {
    const supported = "speechSynthesis" in window;
    setIsSupported(supported);

    if (supported) {
      const loadVoices = () => {
        // getVoices() is async in Chrome — voices only populate after voiceschanged fires
        const voices = window.speechSynthesis.getVoices();
        setVoiceCount(voices.length);
      };

      loadVoices(); // Catches Firefox/Safari which populate synchronously
      window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
      return () =>
        window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
    }
  }, []);

  return (
    <Card
      className={WEB_APIS_CARDS_BASE_STYLES}
      title={<h2 className="font-heading">Speech Synthesis Support</h2>}
      subTitle={
        <p className="font-subHeading">(browser compatibility check)</p>
      }
    >
      {isSupported === null ? (
        <p>Checking...</p>
      ) : isSupported ? (
        <div>
          <p>Speech Synthesis is supported in this browser.</p>
          {voiceCount > 0 && <p>Available voices: {voiceCount}</p>}
        </div>
      ) : (
        <p>Speech Synthesis is not supported in this browser.</p>
      )}
    </Card>
  );
};

export default SpeechSynthesisSupport;
