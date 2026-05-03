import { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { WEB_APIS_CARDS_BASE_STYLES } from "../../../Services/Constants";

// Only the three values defined in CSS Media Queries Level 4 spec.
// sRGB ⊂ P3 ⊂ Rec.2020 — each is a strict superset of the previous.
const GAMUTS: { query: string; label: string }[] = [
  { query: "rec2020", label: "Rec. 2020 (Ultra Wide Gamut)" },
  { query: "p3", label: "Display P3 (Wide Gamut)" },
  { query: "srgb", label: "sRGB" },
];

const getSupportedGamuts = (): string[] =>
  GAMUTS.filter(
    ({ query }) => window.matchMedia(`(color-gamut: ${query})`).matches,
  ).map(({ label }) => label);

const ColorGamutSupport = () => {
  const [colorGamuts, setColorGamuts] = useState<string[]>(getSupportedGamuts);

  useEffect(() => {
    // Re-evaluate when display changes (e.g. window moved to another monitor)
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
    </Card>
  );
};

export default ColorGamutSupport;
