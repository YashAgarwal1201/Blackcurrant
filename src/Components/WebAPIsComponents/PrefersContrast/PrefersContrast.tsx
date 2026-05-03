import { useState, useEffect } from "react";
import { ApiCard, DataRow, DetailSection } from "../Shared/ApiCard";

type ContrastPref = "more" | "less" | "forced" | "no-preference";

const getContrast = (): ContrastPref => {
  if (window.matchMedia("(prefers-contrast: more)").matches) return "more";
  if (window.matchMedia("(prefers-contrast: less)").matches) return "less";
  if (window.matchMedia("(prefers-contrast: forced)").matches) return "forced";
  return "no-preference";
};

const PrefersContrast = () => {
  const [pref, setPref] = useState<ContrastPref>(getContrast);

  useEffect(() => {
    const mqMore = window.matchMedia("(prefers-contrast: more)");
    const mqLess = window.matchMedia("(prefers-contrast: less)");
    const handler = () => setPref(getContrast());
    mqMore.addEventListener("change", handler);
    mqLess.addEventListener("change", handler);
    return () => {
      mqMore.removeEventListener("change", handler);
      mqLess.removeEventListener("change", handler);
    };
  }, []);

  return (
    <ApiCard
      title="Prefers Contrast"
      icon="🔆"
      category="theme-accessibility"
      isLive
      purpose="Detects if the user wants higher or lower contrast. Use this to swap to an accessible high-contrast colour scheme or increase border/text emphasis."
      status="info"
      statusLabel={pref}
      mdnUrl="https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-contrast"
      detailTitle="Prefers Contrast — Details"
      detailContent={
        <div>
          <DetailSection heading="Values">
            <ul className="text-sm text-color5/80 space-y-1 list-disc list-inside leading-relaxed">
              <li>
                <strong>more</strong> — user wants higher contrast (common for
                low vision)
              </li>
              <li>
                <strong>less</strong> — user wants lower contrast (rare)
              </li>
              <li>
                <strong>forced</strong> — OS is enforcing a colour palette (see
                Forced Colors)
              </li>
              <li>
                <strong>no-preference</strong> — no system setting applied
              </li>
            </ul>
          </DetailSection>
          <DetailSection heading="Browser support">
            <p className="text-sm text-color5/80 leading-relaxed">
              Chrome 96+, Edge 96+, Safari 14.1+, Firefox 101+.
            </p>
          </DetailSection>
        </div>
      }
    >
      <div aria-live="polite" aria-atomic="true">
        <DataRow label="Contrast Preference" value={pref} copyable />
      </div>
    </ApiCard>
  );
};

export default PrefersContrast;
