import { useState, useEffect } from "react";
import { Card } from "primereact/card"; // Assuming PrimeReact is installed
import { WEB_APIS_CARDS_BASE_STYLES } from "../../../Services/Constants";

const SpeechSynthesisSupport = () => {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);

  useEffect(() => {
    const checkSpeechSynthesisSupport = () => {
      const isSupported = "speechSynthesis" in window;
      setIsSupported(isSupported);
    };

    // Check for speech synthesis support when component mounts
    checkSpeechSynthesisSupport();
  }, []); // Empty dependency array to run only once on component mount

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
        <p>Speech Synthesis is supported in this browser.</p>
      ) : (
        <p>Speech Synthesis is not supported in this browser.</p>
      )}
    </Card>
  );
};

export default SpeechSynthesisSupport;
