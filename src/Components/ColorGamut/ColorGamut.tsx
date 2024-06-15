import React, { useState, useEffect } from "react";
import { Card } from "primereact/card"; // Assuming PrimeReact is installed

const ColorGamutSupport = ({ baseStyle }: { baseStyle: string }) => {
  const [colorGamut, setColorGamut] = useState<string[]>([]);

  useEffect(() => {
    const checkColorGamutSupport = () => {
      const supportedGamuts = [];

      // Check for DCI-P3 (Wide Gamut) support
      const dciP3MediaQuery = window.matchMedia("(color-gamut: display-p3)");
      if (dciP3MediaQuery && dciP3MediaQuery.matches) {
        supportedGamuts.push("DCI-P3 (Wide Gamut)");
      }

      // Check for Adobe RGB support
      const adobeRgbMediaQuery = window.matchMedia("(color-gamut: adobe-rgb)");
      if (adobeRgbMediaQuery && adobeRgbMediaQuery.matches) {
        supportedGamuts.push("Adobe RGB");
      }

      // Check for sRGB support
      const sRgbMediaQuery = window.matchMedia("(color-gamut: srgb)");
      if (sRgbMediaQuery && sRgbMediaQuery.matches) {
        supportedGamuts.push("sRGB");
      }

      // Check for NTSC support
      const ntscMediaQuery = window.matchMedia("(color-gamut: ntsc)");
      if (ntscMediaQuery && ntscMediaQuery.matches) {
        supportedGamuts.push("NTSC");
      }

      // If no supported gamuts found
      if (supportedGamuts.length === 0) {
        supportedGamuts.push("Unknown");
      }

      return supportedGamuts;
    };

    const updateColorGamutSupport = () => {
      const supportedGamuts = checkColorGamutSupport();
      setColorGamut(supportedGamuts);
    };

    updateColorGamutSupport();
  }, []); // Empty dependency array to run only once on component mount

  return (
    <Card
      className={baseStyle}
      title={<h2 className="font-heading">Color Gamut Support Check</h2>}
      subTitle={
        <p className="font-subHeading">(browser compatibility check)</p>
      }
    >
      {colorGamut.length === 0 ? (
        <p>Checking...</p>
      ) : (
        <div>
          <p>Color Gamuts Supported:</p>
          <ul>
            {colorGamut.map((gamut, index) => (
              <li key={index}>{gamut}</li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
};

export default ColorGamutSupport;
