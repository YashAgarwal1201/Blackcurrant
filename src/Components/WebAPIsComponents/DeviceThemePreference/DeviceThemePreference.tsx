import { useState, useEffect } from "react";
import { ApiCard, DataRow, DetailSection } from "../Shared/ApiCard";

const getTheme = (): "Dark" | "Light" | "No Preference" => {
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "Dark";
  if (window.matchMedia("(prefers-color-scheme: light)").matches)
    return "Light";
  return "No Preference";
};

const ThemePreference = () => {
  const [theme, setTheme] = useState<string>(getTheme);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => setTheme(getTheme());
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  const icon = theme === "Dark" ? "🌙" : theme === "Light" ? "☀️" : "🔆";

  return (
    <ApiCard
      title="Theme Preference"
      icon="🎨"
      status="info"
      mdnUrl="https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme"
      detailTitle="Theme Preference — Details"
      detailContent={
        <div>
          <DetailSection heading="What this reads">
            <p className="text-sm text-color5/80 leading-relaxed">
              The{" "}
              <code className="text-xs bg-white/10 px-1 rounded">
                prefers-color-scheme
              </code>{" "}
              media query reads your operating system's appearance setting
              (dark/light mode). Web developers use this to automatically serve
              a matching UI theme without asking the user.
            </p>
          </DetailSection>
          <DetailSection heading="Live updates">
            <p className="text-sm text-color5/80 leading-relaxed">
              This card listens for changes in real time — switch your OS
              dark/light mode while this page is open and the value updates
              immediately.
            </p>
          </DetailSection>
        </div>
      }
    >
      <div className="flex items-center gap-2">
        <span className="text-xl" aria-hidden="true">
          {icon}
        </span>
        <DataRow label="System theme" value={theme} />
      </div>
    </ApiCard>
  );
};

export default ThemePreference;
