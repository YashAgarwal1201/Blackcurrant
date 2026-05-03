import { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { WEB_APIS_CARDS_BASE_STYLES } from "../../../Services/Constants";

const getThemePreference = (): string => {
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "Dark";
  if (window.matchMedia("(prefers-color-scheme: light)").matches)
    return "Light";
  return "No Preference";
};

const ThemePreference = () => {
  const [themePreference, setThemePreference] =
    useState<string>(getThemePreference);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => setThemePreference(getThemePreference());

    // Live update when user switches system theme while page is open
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  return (
    <Card
      className={WEB_APIS_CARDS_BASE_STYLES}
      title={<h2 className="font-heading">Theme Preference</h2>}
      subTitle={<p className="font-subHeading">(system color scheme)</p>}
    >
      <p>Preferred Theme: {themePreference}</p>
    </Card>
  );
};

export default ThemePreference;
