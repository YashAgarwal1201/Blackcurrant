import { useState, useEffect } from "react";
import { Card } from "primereact/card"; // Assuming PrimeReact is installed
import { WEB_APIS_CARDS_BASE_STYLES } from "../../../Services/Constants";

const SpeechRecognitionSupport = () => {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);

  useEffect(() => {
    const checkSpeechRecognitionSupport = () => {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      setIsSupported(!!SpeechRecognition);
    };

    // Check for speech recognition support when component mounts
    checkSpeechRecognitionSupport();
  }, []); // Empty dependency array to run only once on component mount

  return (
    <Card
      className={WEB_APIS_CARDS_BASE_STYLES}
      title={<h2 className="font-heading">Speech Recognition Support</h2>}
      subTitle={
        <p className="font-subHeading">(browser compatibility check)</p>
      }
    >
      {isSupported === null ? (
        <p>Checking...</p>
      ) : isSupported ? (
        <p>Speech Recognition is supported in this browser.</p>
      ) : (
        <p>Speech Recognition is not supported in this browser.</p>
      )}
    </Card>
  );
};

export default SpeechRecognitionSupport;
