import { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { WEB_APIS_CARDS_BASE_STYLES } from "../../../Services/Constants";

const WindowSize = () => {
  const getWindowSize = () => ({
    css: `${window.innerWidth} x ${window.innerHeight}`,
    physical: `${Math.round(window.innerWidth * window.devicePixelRatio)} x ${Math.round(window.innerHeight * window.devicePixelRatio)}`,
  });

  const [windowSize, setWindowSize] = useState(getWindowSize);

  useEffect(() => {
    const handleResize = () => setWindowSize(getWindowSize());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Card
      className={WEB_APIS_CARDS_BASE_STYLES}
      title={<h2 className="font-heading">Window Size</h2>}
      subTitle={<p className="font-subHeading">(viewport / physical pixels)</p>}
    >
      <p>CSS (viewport): {windowSize.css}</p>
      <p>Physical: {windowSize.physical}</p>
    </Card>
  );
};

export default WindowSize;
