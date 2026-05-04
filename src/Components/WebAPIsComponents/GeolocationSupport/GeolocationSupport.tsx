import { ApiCard, DataRow, DetailSection } from "../Shared/ApiCard";

const GeolocationSupport = () => {
  const supported = "geolocation" in navigator;

  return (
    <ApiCard
      title="Geolocation"
      icon="📍"
      category="media-sensors"
      purpose="Detects whether the Geolocation API is available. Coordinates are only accessible after an explicit user permission prompt — this card checks availability only."
      status={supported ? "supported" : "unsupported"}
      statusLabel={supported ? "Available" : "Not Available"}
      mdnUrl="https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API"
      detailTitle="Geolocation API — Details"
      detailContent={
        <div>
          <DetailSection heading="Availability vs. permission">
            <p className="text-sm text-color5/80 leading-relaxed">
              This card only checks if the API exists. Accessing coordinates
              requires HTTPS and an explicit user prompt via{" "}
              <code className="text-xs bg-white/10 px-1 rounded">
                navigator.geolocation.getCurrentPosition()
              </code>
              . The permission state can be queried separately using the
              Permissions API.
            </p>
          </DetailSection>
          <DetailSection heading="Browser support">
            <p className="text-sm text-color5/80 leading-relaxed">
              All modern browsers support it. Requires a secure context (HTTPS
              or localhost).
            </p>
          </DetailSection>
        </div>
      }
    >
      <DataRow label="API Available" value={supported ? "Yes" : "No"} />
    </ApiCard>
  );
};

export default GeolocationSupport;
