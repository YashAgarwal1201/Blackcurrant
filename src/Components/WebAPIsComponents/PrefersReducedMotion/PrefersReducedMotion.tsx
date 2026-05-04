import { useState, useEffect } from "react";
import { ApiCard, DataRow, DetailSection } from "../Shared/ApiCard";

const PrefersReducedMotion = () => {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  const [reduces, setReduces] = useState(mq.matches);

  useEffect(() => {
    const handler = (e: MediaQueryListEvent) => setReduces(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <ApiCard
      title="Prefers Reduced Motion"
      icon="🎭"
      category="theme-accessibility"
      isLive
      purpose="Detects whether the user has asked the OS to minimise animations. Always respect this — users who set it often have vestibular disorders where motion causes nausea."
      status={reduces ? "partial" : "supported"}
      statusLabel={reduces ? "Reduce Motion" : "Motion OK"}
      mdnUrl="https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion"
      detailTitle="Prefers Reduced Motion — Details"
      detailContent={
        <div>
          <DetailSection heading="How to set it (OS)">
            <ul className="text-sm text-color5/80 space-y-1 list-disc list-inside leading-relaxed">
              <li>
                <strong>macOS</strong> — System Settings → Accessibility →
                Display → Reduce Motion
              </li>
              <li>
                <strong>Windows</strong> — Settings → Accessibility → Visual
                Effects → Animation Effects off
              </li>
              <li>
                <strong>iOS</strong> — Settings → Accessibility → Motion →
                Reduce Motion
              </li>
            </ul>
          </DetailSection>
          <DetailSection heading="CSS pattern">
            <pre className="text-xs text-color5/70 font-mono bg-white/5 rounded-lg p-2 leading-relaxed overflow-x-auto">
              {`@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}`}
            </pre>
          </DetailSection>
        </div>
      }
    >
      <div aria-live="polite" aria-atomic="true">
        <DataRow
          label="Preference"
          value={reduces ? "reduce" : "no-preference"}
          copyable
        />
      </div>
    </ApiCard>
  );
};

export default PrefersReducedMotion;
