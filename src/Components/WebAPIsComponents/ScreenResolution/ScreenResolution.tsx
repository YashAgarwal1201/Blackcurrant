import { useEffect, useState } from "react";
import { ApiCard, DataRow, DetailSection } from "../Shared/ApiCard";

const ScreenResolution = () => {
  const getRes = () => ({
    logical: `${window.screen.width} × ${window.screen.height}`,
    physical: `${Math.round(window.screen.width * window.devicePixelRatio)} × ${Math.round(window.screen.height * window.devicePixelRatio)}`,
    dpr: parseFloat(window.devicePixelRatio.toFixed(2)),
  });

  const [res, setRes] = useState(getRes);

  useEffect(() => {
    const mq = window.matchMedia(
      `(resolution: ${window.devicePixelRatio}dppx)`,
    );
    const handleChange = () => setRes(getRes());
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  return (
    <ApiCard
      title="Screen Resolution"
      icon="🖥️"
      category="display"
      purpose="Logical pixels drive CSS layout; physical pixels drive canvas and image rendering. DPR is the bridge between the two."
      status="info"
      mdnUrl="https://developer.mozilla.org/en-US/docs/Web/API/Screen/width"
      detailTitle="Screen Resolution — Details"
      detailContent={
        <div>
          <DetailSection heading="Logical vs Physical pixels">
            <p className="text-sm text-color5/80 leading-relaxed">
              <strong>Logical pixels</strong> (CSS px) are what layout and media
              queries use. <strong>Physical pixels</strong> are the actual
              hardware pixels on the panel — equal to logical × DPR. On a 2×
              Retina display, one CSS pixel maps to 4 physical pixels.
            </p>
          </DetailSection>
          <DetailSection heading="Device Pixel Ratio">
            <p className="text-sm text-color5/80 leading-relaxed">
              DPR is exposed via{" "}
              <code className="text-xs bg-white/10 px-1 rounded">
                window.devicePixelRatio
              </code>
              . Common values: 1× (standard), 1.5× (some Windows scaling), 2×
              (Retina / HiDPI), 3× (mobile flagship screens).
            </p>
          </DetailSection>
        </div>
      }
    >
      <DataRow label="Logical (CSS pixels)" value={res.logical} mono copyable />
      <DataRow
        label="Physical (hardware px)"
        value={res.physical}
        mono
        copyable
      />
      <DataRow label="Device Pixel Ratio" value={`${res.dpr}×`} copyable />
    </ApiCard>
  );
};

export default ScreenResolution;
