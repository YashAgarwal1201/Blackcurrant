import { useState, useEffect } from "react";
import { ApiCard, DataRow, DetailSection } from "../Shared/ApiCard";

const ScreenResolution = () => {
  const getResolution = () => ({
    logical: `${window.screen.width} × ${window.screen.height}`,
    physical: `${Math.round(window.screen.width * window.devicePixelRatio)} × ${Math.round(window.screen.height * window.devicePixelRatio)}`,
    dpr: parseFloat(window.devicePixelRatio.toFixed(2)),
  });

  const [res, setRes] = useState(getResolution);

  useEffect(() => {
    const handleResize = () => setRes(getResolution());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ApiCard
      title="Screen Resolution"
      icon="🖥️"
      status="info"
      mdnUrl="https://developer.mozilla.org/en-US/docs/Web/API/Screen/width"
      detailTitle="Screen Resolution — Details"
      detailContent={
        <div>
          <DetailSection heading="Logical vs Physical Pixels">
            <p className="text-sm text-color5/80 leading-relaxed">
              <strong>Logical pixels</strong> (CSS pixels) are what the browser
              uses for layout. On HiDPI/Retina displays, each CSS pixel maps to
              multiple hardware pixels — controlled by the OS display scale
              setting.
            </p>
            <p className="text-sm text-color5/80 mt-2 leading-relaxed">
              <strong>Physical pixels</strong> = Logical × DPR. This is the true
              hardware resolution rendered.
            </p>
          </DetailSection>
          <DetailSection heading="Device Pixel Ratio (DPR)">
            <p className="text-sm text-color5/80 leading-relaxed">
              Your DPR is <strong>{res.dpr}×</strong>. A DPR of 2 means each CSS
              pixel is 2×2 physical pixels. Changing OS UI scale changes the
              DPR.
            </p>
          </DetailSection>
        </div>
      }
    >
      <DataRow label="Logical (CSS pixels)" value={res.logical} mono />
      <DataRow label="Physical (hardware px)" value={res.physical} mono />
      <DataRow label="Device Pixel Ratio" value={`${res.dpr}×`} />
    </ApiCard>
  );
};

export default ScreenResolution;
