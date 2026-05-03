import { ApiCard, DataRow, CaveatNote, DetailSection } from "../Shared/ApiCard";

const DeviceMemory = () => {
  const mem = (navigator as any).deviceMemory as number | undefined;
  const supported = mem !== undefined;

  return (
    <ApiCard
      title="Device Memory"
      icon="🧠"
      category="device-hardware"
      purpose="Returns a coarse approximation of RAM in GB. Use it to decide whether to load a lightweight or full-featured version of your app."
      status={supported ? "info" : "unsupported"}
      statusLabel={supported ? `${mem} GB` : "Not Available"}
      mdnUrl="https://developer.mozilla.org/en-US/docs/Web/API/Navigator/deviceMemory"
      detailTitle="Device Memory API — Details"
      detailContent={
        <div>
          <DetailSection heading="What the value means">
            <p className="text-sm text-color5/80 leading-relaxed">
              The value is intentionally rounded to the nearest power of 2
              (0.25, 0.5, 1, 2, 4, 8 GB) to prevent precise fingerprinting. It
              reflects the device's total RAM, not what's available to the page.
            </p>
          </DetailSection>
          <DetailSection heading="Adaptive loading pattern">
            <pre className="text-xs text-color5/70 font-mono bg-white/5 rounded-lg p-2 leading-relaxed overflow-x-auto">
              {`if (navigator.deviceMemory < 1) {
  // load lite bundle
} else {
  // load full bundle
}`}
            </pre>
          </DetailSection>
          <DetailSection heading="Browser support">
            <p className="text-sm text-color5/80 leading-relaxed">
              Chrome 63+, Edge 79+. Not implemented in Firefox or Safari.
            </p>
          </DetailSection>
        </div>
      }
    >
      {!supported ? (
        <CaveatNote>
          Device Memory API is not available in this browser (Firefox / Safari).
        </CaveatNote>
      ) : (
        <DataRow label="Approximate RAM" value={`${mem} GB`} copyable />
      )}
    </ApiCard>
  );
};

export default DeviceMemory;
