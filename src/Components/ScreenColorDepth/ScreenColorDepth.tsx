import { useEffect, useState } from "react";
import { Card } from "primereact/card";

function ScreenColorDepth() {
  const [colorDepth, setColorDepth] = useState(0);

  useEffect(() => {
    // Get the color depth of the screen
    const depth = window.screen.colorDepth;
    setColorDepth(depth);
  }, []);

  const cardStyle = "rounded-md";

  return (
    <Card className={cardStyle} title={<h2></h2>} subTitle={<p></p>}>
      {colorDepth}
    </Card>
  );
}

export default ScreenColorDepth;
