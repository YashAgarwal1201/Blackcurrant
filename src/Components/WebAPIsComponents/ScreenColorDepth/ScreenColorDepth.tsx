import { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { WEB_APIS_CARDS_BASE_STYLES } from "../../../Services/Constants";

function ScreenColorDepth() {
  const [colorDepth, setColorDepth] = useState(0);

  useEffect(() => {
    // Get the color depth of the screen
    const depth = window.screen.colorDepth;
    setColorDepth(depth);
  }, []);

  return (
    <Card
      className={WEB_APIS_CARDS_BASE_STYLES}
      title={<h2 className="font-heading"></h2>}
      subTitle={<p className="font-subHeading"></p>}
    >
      {colorDepth}
    </Card>
  );
}

export default ScreenColorDepth;
