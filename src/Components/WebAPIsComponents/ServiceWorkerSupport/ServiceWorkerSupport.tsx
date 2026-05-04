import { ApiCard, DataRow, DetailSection } from "../Shared/ApiCard";

const ServiceWorkerSupport = () => {
  const supported = "serviceWorker" in navigator;

  return (
    <ApiCard
      title="Service Worker"
      icon="⚙️"
      category="browser-environment"
      purpose="Service Workers power offline caching, background sync, and push notifications. Gate all PWA features behind this check."
      status={supported ? "supported" : "unsupported"}
      statusLabel={supported ? "Supported" : "Not Supported"}
      mdnUrl="https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API"
      detailTitle="Service Worker Support — Details"
      detailContent={
        <div>
          <DetailSection heading="What it enables">
            <p className="text-sm text-color5/80 leading-relaxed">
              A Service Worker is a script that runs in the background,
              independent of the page. It intercepts network requests (for
              offline support), receives push messages, and handles background
              sync — the core of any installable PWA.
            </p>
          </DetailSection>
          <DetailSection heading="Availability check pattern">
            <pre className="text-xs text-color5/70 font-mono bg-white/5 rounded-lg p-2 leading-relaxed overflow-x-auto">
              {`if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}`}
            </pre>
          </DetailSection>
          <DetailSection heading="Browser support">
            <p className="text-sm text-color5/80 leading-relaxed">
              All modern browsers. Requires HTTPS (or localhost).
            </p>
          </DetailSection>
        </div>
      }
    >
      <DataRow label="API Available" value={supported ? "Yes" : "No"} />
    </ApiCard>
  );
};

export default ServiceWorkerSupport;
