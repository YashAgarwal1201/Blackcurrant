import { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { WEB_APIS_CARDS_BASE_STYLES } from "../../../Services/Constants";

function ScreenColorDepth() {
  const [colorDepth, setColorDepth] = useState<number>(0);
  const [pixelDepth, setPixelDepth] = useState<number>(0);

  useEffect(() => {
    setColorDepth(window.screen.colorDepth);
    setPixelDepth(window.screen.pixelDepth);
  }, []);

  return (
    <Card
      className={WEB_APIS_CARDS_BASE_STYLES}
      title={<h2 className="font-heading">Screen Color Depth</h2>}
      subTitle={<p className="font-subHeading">(bits per pixel)</p>}
    >
      <p>Color Depth: {colorDepth}-bit</p>
      <p>Pixel Depth: {pixelDepth}-bit</p>
    </Card>
  );
}

export default ScreenColorDepth;
