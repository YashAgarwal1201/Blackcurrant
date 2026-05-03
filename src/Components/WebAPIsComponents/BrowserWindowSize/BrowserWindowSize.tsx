import { useState, useEffect } from "react";
import { ApiCard, DataRow, DetailSection } from "../Shared/ApiCard";

const WindowSize = () => {
  const getWindowSize = () => ({
    css: `${window.innerWidth} × ${window.innerHeight}`,
    physical: `${Math.round(window.innerWidth * window.devicePixelRatio)} × ${Math.round(window.innerHeight * window.devicePixelRatio)}`,
    dpr: parseFloat(window.devicePixelRatio.toFixed(2)),
  });

  const [size, setSize] = useState(getWindowSize);

  useEffect(() => {
    const handleResize = () => setSize(getWindowSize());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ApiCard
      title="Window Size"
      icon="📐"
      category="display"
      isLive
      purpose="The CSS viewport is what all your layout calculations use. Physical size matters when targeting Hi-DPI canvas or image rendering."
      status="info"
      mdnUrl="https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth"
      detailTitle="Window Size — Details"
      detailContent={
        <div>
          <DetailSection heading="Viewport vs Screen">
            <p className="text-sm text-color5/80 leading-relaxed">
              <strong>Window size</strong> is the visible browser viewport — it
              changes when you resize the window, open DevTools, or zoom.{" "}
              <strong>Screen resolution</strong> (separate card) is the full
              display size.
            </p>
          </DetailSection>
          <DetailSection heading="CSS vs Physical">
            <p className="text-sm text-color5/80 leading-relaxed">
              CSS viewport uses logical pixels for layout. Physical = CSS × DPR
              ({size.dpr}×), which is the actual pixel area being rendered to
              screen.
            </p>
          </DetailSection>
        </div>
      }
    >
      <DataRow label="CSS Viewport" value={size.css} mono copyable />
      <DataRow
        label="Physical (rendered px)"
        value={size.physical}
        mono
        copyable
      />
      <DataRow label="Device Pixel Ratio" value={`${size.dpr}×`} copyable />
    </ApiCard>
  );
};

export default WindowSize;
