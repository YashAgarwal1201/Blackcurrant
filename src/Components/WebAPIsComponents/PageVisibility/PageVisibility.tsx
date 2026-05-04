import { useState, useEffect } from "react";
import { ApiCard, DataRow, DetailSection } from "../Shared/ApiCard";
import type { StatusType } from "../Shared/ApiCard";

const PageVisibility = () => {
  const [state, setState] = useState<DocumentVisibilityState>(
    document.visibilityState,
  );

  useEffect(() => {
    const handler = () => setState(document.visibilityState);
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);

  const status: StatusType = state === "visible" ? "supported" : "partial";

  return (
    <ApiCard
      title="Page Visibility"
      icon="👁️"
      category="performance"
      isLive
      purpose="Tells you if the tab is currently visible or hidden. Use this to pause video, stop animations, or throttle polling when the user switches away."
      status={status}
      statusLabel={state === "visible" ? "Visible" : "Hidden"}
      mdnUrl="https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API"
      detailTitle="Page Visibility API — Details"
      detailContent={
        <div>
          <DetailSection heading="The two states">
            <ul className="text-sm text-color5/80 space-y-1 list-disc list-inside leading-relaxed">
              <li>
                <strong>visible</strong> — the tab is in the foreground and at
                least partially on screen.
              </li>
              <li>
                <strong>hidden</strong> — the tab is in the background,
                minimised, or the screen is off.
              </li>
            </ul>
          </DetailSection>
          <DetailSection heading="Pattern: pause on hide">
            <pre className="text-xs text-color5/70 font-mono bg-white/5 rounded-lg p-2 leading-relaxed overflow-x-auto">
              {`document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    video.pause();
    clearInterval(pollInterval);
  } else {
    video.play();
    startPolling();
  }
});`}
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
      <div aria-live="polite" aria-atomic="true">
        <DataRow label="Visibility State" value={state} copyable />
      </div>
    </ApiCard>
  );
};

export default PageVisibility;
