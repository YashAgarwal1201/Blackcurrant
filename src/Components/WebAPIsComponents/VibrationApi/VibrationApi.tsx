import { ApiCard, DataRow, CaveatNote, DetailSection } from "../Shared/ApiCard";

const VibrationApi = () => {
  const supported = "vibrate" in navigator;

  return (
    <ApiCard
      title="Vibration API"
      icon="📳"
      category="media-sensors"
      purpose="Lets you trigger device vibration for haptic feedback. Primarily useful for mobile web games and form-submission confirmations."
      status={supported ? "supported" : "unsupported"}
      statusLabel={supported ? "Supported" : "Not Supported"}
      mdnUrl="https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API"
      detailTitle="Vibration API — Details"
      detailContent={
        <div>
          <DetailSection heading="Usage">
            <pre className="text-xs text-color5/70 font-mono bg-white/5 rounded-lg p-2 leading-relaxed overflow-x-auto">
              {`// Single pulse — 200ms
navigator.vibrate(200);

// Pattern — buzz, pause, buzz
navigator.vibrate([100, 50, 100]);

// Cancel
navigator.vibrate(0);`}
            </pre>
          </DetailSection>
          <DetailSection heading="Browser support">
            <p className="text-sm text-color5/80 leading-relaxed">
              Chrome for Android, Firefox for Android. Not implemented on iOS
              Safari or desktop browsers.
            </p>
          </DetailSection>
        </div>
      }
    >
      {!supported ? (
        <CaveatNote>
          Vibration API is not available — most likely a desktop browser or iOS
          Safari.
        </CaveatNote>
      ) : (
        <DataRow label="API Available" value="Yes" />
      )}
    </ApiCard>
  );
};

export default VibrationApi;
