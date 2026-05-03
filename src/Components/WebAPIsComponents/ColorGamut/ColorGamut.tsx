import { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { WEB_APIS_CARDS_BASE_STYLES } from "../../../Services/Constants";

const GAMUTS: { query: string; label: string }[] = [
  { query: "rec2020", label: "Rec. 2020 (Ultra Wide Gamut)" },
  { query: "p3", label: "Display P3 (Wide Gamut)" },
  { query: "srgb", label: "sRGB" },
];

const getSupportedGamuts = (): string[] =>
  GAMUTS.filter(
    ({ query }) => window.matchMedia(`(color-gamut: ${query})`).matches,
  ).map(({ label }) => label);

const hasCompositorCaveat = (): boolean => {
  const ua = navigator.userAgent;
  // WebKitGTK on Linux reads colour gamut from GTK/colord stack, not EDID.
  // Chromium/Brave read EDID directly — which is why Brave may show P3
  // on the same hardware where Epiphany only shows sRGB.
  return (
    /AppleWebKit/.test(ua) &&
    !/Chrome\//.test(ua) &&
    (/Linux/.test(ua) || /X11/.test(ua))
  );
};

const ColorGamutSupport = () => {
  const [colorGamuts, setColorGamuts] = useState<string[]>(getSupportedGamuts);
  const [showCaveat] = useState<boolean>(hasCompositorCaveat);

  useEffect(() => {
    const mq = window.matchMedia("(color-gamut: p3)");
    const handleChange = () => setColorGamuts(getSupportedGamuts());
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  return (
    <Card
      className={WEB_APIS_CARDS_BASE_STYLES}
      title={<h2 className="font-heading">Color Gamut Support</h2>}
      subTitle={
        <p className="font-subHeading">(browser compatibility check)</p>
      }
    >
      {colorGamuts.length === 0 ? (
        <p>Unknown — no supported gamut detected.</p>
      ) : (
        <div>
          <p>Color Gamuts Supported:</p>
          <ul>
            {colorGamuts.map((gamut) => (
              <li key={gamut}>{gamut}</li>
            ))}
          </ul>
        </div>
      )}
      {showCaveat && (
        <p style={{ fontSize: "0.75rem", marginTop: "0.5rem", opacity: 0.8 }}>
          Note: On Linux, gamut detection depends on the system colour
          management stack (colord/GTK), not raw display EDID. Wide-gamut
          displays may not be reported correctly here.
        </p>
      )}
    </Card>
  );
};

export default ColorGamutSupport;
