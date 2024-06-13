import React, { useState, useEffect } from "react";
import { Card } from "primereact/card"; // Assuming PrimeReact is installed

const ColorGamutSupport = ({ baseStyle }: { baseStyle: string }) => {
  const [colorGamut, setColorGamut] = useState<string | null>(null);

  useEffect(() => {
    const checkColorGamutSupport = async () => {
      if (!window.matchMedia) return null;

      const wideGamutMediaQuery = window.matchMedia("(color-gamut: p3)");
      const displayP3 = wideGamutMediaQuery && wideGamutMediaQuery.matches;

      if (displayP3) {
        return "Display P3 (Wide Gamut)";
      }

      const adobeRgbMediaQuery = window.matchMedia("(color-gamut: adobe-rgb)");
      const adobeRgb = adobeRgbMediaQuery && adobeRgbMediaQuery.matches;

      if (adobeRgb) {
        return "Adobe RGB";
      }

      const sRgbMediaQuery = window.matchMedia("(color-gamut: srgb)");
      const sRgb = sRgbMediaQuery && sRgbMediaQuery.matches;

      if (sRgb) {
        return "sRGB";
      }

      return "Unknown";
    };

    checkColorGamutSupport().then((result) => {
      setColorGamut(result);
    });
  }, []); // Empty dependency array to run only once on component mount

  return (
    <Card
      className={baseStyle}
      title={<h2 className="font-heading">Color Gamut Support Check</h2>}
      subTitle={
        <p className="font-subHeading">(browser compatibility check)</p>
      }
    >
      {colorGamut === null ? (
        <p>Checking...</p>
      ) : (
        <p>Color Gamut Support: {colorGamut}</p>
      )}
    </Card>
  );
};

export default ColorGamutSupport;
