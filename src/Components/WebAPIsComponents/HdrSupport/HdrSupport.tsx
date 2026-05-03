import { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { WEB_APIS_CARDS_BASE_STYLES } from "../../../Services/Constants";

interface HdrResult {
  supported: boolean;
  // True when dynamic-range:high OR color-gamut:rec2020 matches
  viaCssQuery: boolean;
  // Heuristic: 10-bit colour depth suggests HDR-capable pipeline
  via10Bit: boolean;
  // True on Linux/WebKitGTK where compositor may not report HDR accurately
  hasCompositorCaveat: boolean;
}

const checkHdr = (): HdrResult => {
  const viaCssQuery =
    window.matchMedia("(dynamic-range: high)").matches ||
    window.matchMedia("(color-gamut: rec2020)").matches;

  const via10Bit = window.screen.colorDepth >= 30;

  // WebKitGTK on Linux doesn't expose HDR via CSS media queries
  // even on HDR-capable hardware — it depends on colord/GTK colour stack
  const ua = navigator.userAgent;
  const isWebKitOnLinux =
    /AppleWebKit/.test(ua) &&
    !/Chrome\//.test(ua) &&
    (/Linux/.test(ua) || /X11/.test(ua));

  return {
    supported: viaCssQuery || via10Bit,
    viaCssQuery,
    via10Bit,
    hasCompositorCaveat: isWebKitOnLinux,
  };
};

const HdrSupportCheck = () => {
  const [result, setResult] = useState<HdrResult>(checkHdr);

  useEffect(() => {
    const mq = window.matchMedia("(dynamic-range: high)");
    const handleChange = () => setResult(checkHdr());
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
      {result.supported ? (
        <p>HDR is supported in this browser.</p>
      ) : (
        <p>HDR is not detected in this browser.</p>
      )}
      {result.hasCompositorCaveat && (
        <p style={{ fontSize: "0.75rem", marginTop: "0.5rem", opacity: 0.8 }}>
          Note: On Linux, this reflects what the system compositor reports — not
          raw hardware capability. HDR may be available on your display but
          unreported by the GTK colour stack.
        </p>
      )}
    </Card>
  );
};

export default HdrSupportCheck;
