import { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { WEB_APIS_CARDS_BASE_STYLES } from "../../../Services/Constants";

const getOrientation = (): string => {
  if (window.screen.orientation?.type) return window.screen.orientation.type;
  if (typeof (window as any).orientation !== "undefined") {
    const angle = (window as any).orientation as number;
    return angle === 0 || angle === 180
      ? "portrait-primary"
      : "landscape-primary";
  }
  return window.innerWidth > window.innerHeight
    ? "landscape-primary"
    : "portrait-primary";
};

const ScreenOrientation = () => {
  const [orientation, setOrientation] = useState<string>(getOrientation);

  useEffect(() => {
    const handleChange = () => setOrientation(getOrientation());
    if (window.screen.orientation) {
      window.screen.orientation.addEventListener("change", handleChange);
    }
    window.addEventListener("orientationchange", handleChange); // deprecated but iOS fallback
    window.addEventListener("resize", handleChange); // catch-all
    return () => {
      if (window.screen.orientation) {
        window.screen.orientation.removeEventListener("change", handleChange);
      }
      window.removeEventListener("orientationchange", handleChange);
      window.removeEventListener("resize", handleChange);
    };
  }, []);

  return (
    <Card
      className={WEB_APIS_CARDS_BASE_STYLES}
      title={<h2 className="font-heading">Screen Orientation</h2>}
      subTitle={<p className="font-subHeading">(current orientation)</p>}
    >
      {orientation}
    </Card>
  );
};

export default ScreenOrientation;
