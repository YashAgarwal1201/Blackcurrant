import React, { useState, useEffect } from "react";
import { Card } from "primereact/card"; // Assuming PrimeReact is installed

const SpeechSynthesisSupport = ({ baseStyle }: { baseStyle: string }) => {
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
      className={baseStyle}
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
