import { useState, useEffect } from "react";
import { ApiCard, CaveatNote, DetailSection } from "../Shared/ApiCard";

const GAMUTS = [
  {
    query: "rec2020",
    label: "Rec. 2020",
    desc: "Ultra Wide Gamut — used in UHD/HDR content",
  },
  {
    query: "p3",
    label: "Display P3",
    desc: "Wide Gamut — used in modern Apple & high-end displays",
  },
  {
    query: "srgb",
    label: "sRGB",
    desc: "Standard — covers ~99% of consumer displays",
  },
];

const getSupportedGamuts = () =>
  GAMUTS.filter(
    ({ query }) => window.matchMedia(`(color-gamut: ${query})`).matches,
  );

const isLinuxBrowser = () => {
  const ua = navigator.userAgent;
  return /Linux/.test(ua) || /X11/.test(ua);
};

const ColorGamutSupport = () => {
  const [gamuts, setGamuts] = useState(getSupportedGamuts);
  const isLinux = isLinuxBrowser();

  useEffect(() => {
    const mq = window.matchMedia("(color-gamut: p3)");
    const handleChange = () => setGamuts(getSupportedGamuts());
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  const topGamut = gamuts[0];
  const showCaveat = isLinux && !gamuts.some((g) => g.query !== "srgb");

  return (
    <ApiCard
      title="Color Gamut"
      icon="🌈"
      category="display"
      purpose="Display P3 covers ~25% more colours than sRGB. Use this to conditionally serve wide-gamut images or CSS colours only to capable displays."
      status={
        topGamut?.query === "rec2020"
          ? "supported"
          : topGamut?.query === "p3"
            ? "supported"
            : "info"
      }
      statusLabel={topGamut?.label ?? "Unknown"}
      mdnUrl="https://developer.mozilla.org/en-US/docs/Web/CSS/@media/color-gamut"
      detailTitle="Color Gamut — Details"
      detailContent={
        <div>
          <DetailSection heading="What colour gamut means">
            <p className="text-sm text-color5/80 leading-relaxed">
              Colour gamut is the range of colours a display can reproduce.
              Wider gamuts enable more vivid, accurate colour — essential for
              photo editing and HDR video.
            </p>
          </DetailSection>
          <DetailSection heading="Gamut hierarchy">
            <ul className="text-sm text-color5/80 space-y-1 list-disc list-inside leading-relaxed">
              <li>
                <strong>sRGB</strong> — Standard. All modern displays support
                this.
              </li>
              <li>
                <strong>Display P3</strong> — ~25% wider than sRGB. Common in
                Apple, high-end monitors.
              </li>
              <li>
                <strong>Rec. 2020</strong> — ~57% wider than sRGB.
                Professional/UHD displays only.
              </li>
            </ul>
          </DetailSection>
          <DetailSection heading="Linux limitation">
            <p className="text-sm text-color5/80 leading-relaxed">
              Chromium/Brave reads gamut directly from display EDID. WebKitGTK
              (Epiphany) and some Firefox builds rely on the OS colour
              management stack (colord/GTK), which often reports only sRGB even
              on P3-capable hardware.
            </p>
          </DetailSection>
        </div>
      }
    >
      {gamuts.length === 0 ? (
        <p className="text-sm text-color5/60">
          No gamut information available.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {gamuts.map(({ label, desc }) => (
            <div key={label} className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">✓ {label}</span>
              <span className="text-xs text-color5/50">{desc}</span>
            </div>
          ))}
        </div>
      )}
      {showCaveat && (
        <CaveatNote>
          On Linux, gamut detection depends on the system colour stack
          (colord/GTK), not the display EDID. Wide-gamut displays may report as
          sRGB-only here.
        </CaveatNote>
      )}
    </ApiCard>
  );
};

export default ColorGamutSupport;
