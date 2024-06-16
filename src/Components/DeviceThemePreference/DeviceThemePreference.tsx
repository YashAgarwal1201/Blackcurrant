import React, { useState, useEffect } from "react";
import { Card } from "primereact/card"; // Assuming PrimeReact is installed

const ThemePreference = ({ baseStyle }: { baseStyle: string }) => {
  const [themePreference, setThemePreference] = useState<string | null>(null);

  useEffect(() => {
    const checkThemePreference = () => {
      const prefersDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const prefersLightMode = window.matchMedia(
        "(prefers-color-scheme: light)"
      ).matches;

      if (prefersDarkMode) {
        return "Dark";
      } else if (prefersLightMode) {
        return "Light";
      } else {
        return "Unknown";
      }
    };

    const updateThemePreference = () => {
      const preference = checkThemePreference();
      setThemePreference(preference);
    };

    updateThemePreference();
  }, []); // Empty dependency array to run only once on component mount

  return (
    <Card
      className={baseStyle}
      title={<h2 className="font-heading">Theme Preference</h2>}
      subTitle={<p className="font-subHeading">(system color scheme)</p>}
    >
      {themePreference === null ? (
        <p>Checking...</p>
      ) : (
        <p>Preferred Theme: {themePreference}</p>
      )}
    </Card>
  );
};

export default ThemePreference;
