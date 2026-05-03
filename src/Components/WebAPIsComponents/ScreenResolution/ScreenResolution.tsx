import { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { WEB_APIS_CARDS_BASE_STYLES } from "../../../Services/Constants";

const ScreenResolution = () => {
  const getResolution = () => ({
    logical: `${window.screen.width} x ${window.screen.height}`,
    physical: `${Math.round(window.screen.width * window.devicePixelRatio)} x ${Math.round(window.screen.height * window.devicePixelRatio)}`,
    dpr: window.devicePixelRatio,
  });

  const [resolution, setResolution] = useState(getResolution);

  useEffect(() => {
    const handleResize = () => setResolution(getResolution());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Card
      className={WEB_APIS_CARDS_BASE_STYLES}
      title={<h2 className="font-heading">Screen Resolution</h2>}
      subTitle={<p className="font-subHeading">(logical / physical pixels)</p>}
    >
      <p>Logical: {resolution.logical}</p>
      <p>Physical: {resolution.physical}</p>
      <p>Device Pixel Ratio: {resolution.dpr}</p>
    </Card>
  );
};

export default ScreenResolution;
