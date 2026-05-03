import { ApiCard, DataRow, DetailSection } from "../Shared/ApiCard";

const TouchSupport = () => {
  const maxPoints = navigator.maxTouchPoints;
  const hasTouch = maxPoints > 0;
  const hasCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const pointerType = hasCoarsePointer
    ? "Coarse (touch/stylus)"
    : "Fine (mouse/trackpad)";

  return (
    <ApiCard
      title="Touch Support"
      icon="👆"
      category="device-hardware"
      purpose="Detects touch capability and pointer precision. Use pointer: coarse to show larger tap targets and simpler interactions on touch-first devices."
      status={hasTouch ? "supported" : "info"}
      statusLabel={hasTouch ? "Touch Capable" : "Mouse/Trackpad"}
      mdnUrl="https://developer.mozilla.org/en-US/docs/Web/API/Navigator/maxTouchPoints"
      detailTitle="Touch Support — Details"
      detailContent={
        <div>
          <DetailSection heading="maxTouchPoints vs pointer media query">
            <p className="text-sm text-color5/80 leading-relaxed">
              <code className="text-xs bg-white/10 px-1 rounded">
                maxTouchPoints
              </code>{" "}
              tells you the maximum simultaneous touch contacts supported. The{" "}
              <code className="text-xs bg-white/10 px-1 rounded">
                (pointer: coarse)
              </code>{" "}
              media query tells you whether the <em>primary</em> input is
              imprecise (finger/stylus). A Surface Pro will have both —
              touchscreen AND a fine mouse pointer.
            </p>
          </DetailSection>
          <DetailSection heading="CSS pattern">
            <pre className="text-xs text-color5/70 font-mono bg-white/5 rounded-lg p-2 leading-relaxed overflow-x-auto">
              {`@media (pointer: coarse) {
  .btn { min-height: 44px; padding: 12px 20px; }
}`}
            </pre>
          </DetailSection>
          <DetailSection heading="Browser support">
            <p className="text-sm text-color5/80 leading-relaxed">
              Universally supported in all modern browsers.
            </p>
          </DetailSection>
        </div>
      }
    >
      <DataRow label="Max Touch Points" value={`${maxPoints}`} copyable />
      <DataRow label="Primary Pointer" value={pointerType} />
    </ApiCard>
  );
};

export default TouchSupport;
