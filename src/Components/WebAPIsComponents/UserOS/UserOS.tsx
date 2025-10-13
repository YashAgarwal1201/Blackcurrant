import { useState, useEffect } from "react";
import { Card } from "primereact/card"; // Assuming PrimeReact is installed
import { WEB_APIS_CARDS_BASE_STYLES } from "../../../Services/Constants";

const OsDetection = () => {
  const [osName, setOsName] = useState<string | null>(null);

  useEffect(() => {
    const detectOs = () => {
      const userAgent = window.navigator.userAgent;
      let os = "Unknown";

      // Detect specific OS
      if (/Windows/.test(userAgent)) {
        os = "Windows";
      } else if (/Mac/.test(userAgent)) {
        os = "MacOS";
      } else if (/iPad|iPhone|iPod/.test(userAgent)) {
        os = "iOS";
      } else if (/Android/.test(userAgent)) {
        // Check for tablet-specific identifiers to differentiate from desktop mode
        if (
          /Tablet|Pad/.test(userAgent) ||
          (/Android/.test(userAgent) && !/Mobile/.test(userAgent))
        ) {
          os = "Android Tablet";
        } else {
          os = "Android";
        }
      } else if (/Linux/.test(userAgent)) {
        os = "Linux";
      }

      return os;
    };

    const updateOs = () => {
      const detectedOs = detectOs();
      setOsName(detectedOs);
    };

    updateOs();
  }, []); // Empty dependency array to run only once on component mount

  return (
    <Card
      className={WEB_APIS_CARDS_BASE_STYLES}
      title={<h2 className="font-heading">OS Detection</h2>}
      subTitle={
        <p className="font-subHeading">(browser compatibility check)</p>
      }
    >
      {osName === null ? <p>Detecting OS...</p> : <p>{osName}</p>}
    </Card>
  );
};

export default OsDetection;
