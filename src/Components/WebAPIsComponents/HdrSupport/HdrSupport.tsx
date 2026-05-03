import { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { WEB_APIS_CARDS_BASE_STYLES } from "../../../Services/Constants";

const checkHdr = (): boolean =>
  window.matchMedia("(dynamic-range: high)").matches ||
  window.matchMedia("(color-gamut: rec2020)").matches;

const HdrSupportCheck = () => {
  const [isHdrSupported, setIsHdrSupported] = useState<boolean>(checkHdr);

  useEffect(() => {
    // Listen for display changes (e.g. HDR toggle in OS settings)
    const mq = window.matchMedia("(dynamic-range: high)");
    const handleChange = () => setIsHdrSupported(checkHdr());
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  return (
    <Card
      className={WEB_APIS_CARDS_BASE_STYLES}
      title={<h2 className="font-heading">HDR Support Check</h2>}
      subTitle={
        <p className="font-subHeading">(browser compatibility check)</p>
      }
    >
      {isHdrSupported ? (
        <p>HDR is supported in this browser.</p>
      ) : (
        <p>HDR is not supported in this browser.</p>
      )}
    </Card>
  );
};

export default HdrSupportCheck;
