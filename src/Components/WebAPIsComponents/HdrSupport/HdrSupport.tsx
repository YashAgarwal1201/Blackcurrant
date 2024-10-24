import { useState, useEffect } from "react";
import { Card } from "primereact/card"; // Assuming PrimeReact is installed

const HdrSupportCheck = ({ baseStyle }: { baseStyle: string }) => {
  const [isHdrSupported, setIsHdrSupported] = useState<boolean | null>(null);

  useEffect(() => {
    const checkHdrSupport = () => {
      // Use a media query that is likely to indicate HDR support
      const mediaQueries = [
        "(dynamic-range: high)",
        "(color-gamut: rec2020)",
        "(max-color-index: 0)",
      ];

      return mediaQueries.some((query) => window.matchMedia(query).matches);
    };

    const updateHdrSupport = () => {
      const hdrSupported = checkHdrSupport();
      setIsHdrSupported(hdrSupported);
    };

    updateHdrSupport();
  }, []); // Empty dependency array to run only once on component mount

  return (
    <Card
      className={baseStyle}
      title={<h2 className="font-heading">HDR Support Check</h2>}
      subTitle={
        <p className="font-subHeading">(browser compatibility check)</p>
      }
    >
      {isHdrSupported === null ? (
        <p>Checking...</p>
      ) : isHdrSupported ? (
        <p>HDR is supported in this browser.</p>
      ) : (
        <p>HDR is not supported in this browser.</p>
      )}
    </Card>
  );
};

export default HdrSupportCheck;
