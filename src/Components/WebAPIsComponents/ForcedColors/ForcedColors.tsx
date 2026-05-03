import { useState, useEffect } from "react";
import { ApiCard, DataRow, CaveatNote, DetailSection } from "../Shared/ApiCard";

const ForcedColors = () => {
  const mq = window.matchMedia("(forced-colors: active)");
  const [active, setActive] = useState(mq.matches);

  useEffect(() => {
    const handler = (e: MediaQueryListEvent) => setActive(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <ApiCard
      title="Forced Colors"
      icon="🎨"
      category="theme-accessibility"
      isLive
      purpose="Detects Windows High Contrast Mode (and similar OS palettes). When active, the OS overrides your CSS colours — you should reinstate borders and focus rings explicitly."
      status={active ? "partial" : "info"}
      statusLabel={active ? "Active" : "Inactive"}
      mdnUrl="https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors"
      detailTitle="Forced Colors — Details"
      detailContent={
        <div>
          <DetailSection heading="What it means for your CSS">
            <p className="text-sm text-color5/80 leading-relaxed">
              When{" "}
              <code className="text-xs bg-white/10 px-1 rounded">
                forced-colors: active
              </code>
              , the browser replaces most colours with OS-defined system
              colours. Background images, box shadows, and custom colour
              properties are removed. You must use{" "}
              <code className="text-xs bg-white/10 px-1 rounded">
                forced-color-adjust: none
              </code>{" "}
              on components that must retain their colours (e.g. status badges).
            </p>
          </DetailSection>
          <DetailSection heading="CSS pattern">
            <pre className="text-xs text-color5/70 font-mono bg-white/5 rounded-lg p-2 leading-relaxed overflow-x-auto">
              {`@media (forced-colors: active) {
  .btn {
    border: 2px solid ButtonText;
    forced-color-adjust: none;
  }
}`}
            </pre>
          </DetailSection>
          <DetailSection heading="How to test">
            <p className="text-sm text-color5/80 leading-relaxed">
              Windows: Settings → Accessibility → Contrast Themes. Or emulate in
              Chrome DevTools → Rendering → Emulate CSS media → forced-colors.
            </p>
          </DetailSection>
        </div>
      }
    >
      <div aria-live="polite" aria-atomic="true">
        <DataRow
          label="Forced Colors"
          value={active ? "Active" : "Inactive"}
          copyable
        />
      </div>
      {active && (
        <CaveatNote>
          OS is overriding your CSS colour palette. Ensure borders and focus
          indicators are defined with system colour keywords.
        </CaveatNote>
      )}
    </ApiCard>
  );
};

export default ForcedColors;
