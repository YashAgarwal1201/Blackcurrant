import { useEffect, useState } from "react";
import { ApiCard, DataRow, DetailSection } from "../Shared/ApiCard";

const DEPTH_LABELS: Record<number, string> = {
  1: "Monochrome",
  8: "256 colours",
  16: "High colour",
  24: "True colour — 16.7M colours",
  30: "Deep colour — ~1B colours (10-bit)",
  32: "True colour + alpha",
  48: "Deep colour (16-bit per channel)",
};

const depthLabel = (d: number) => DEPTH_LABELS[d] ?? `${d}-bit`;

function ScreenColorDepth() {
  const [colorDepth, setColorDepth] = useState(0);
  const [pixelDepth, setPixelDepth] = useState(0);

  useEffect(() => {
    setColorDepth(window.screen.colorDepth);
    setPixelDepth(window.screen.pixelDepth);
  }, []);

  const is10Bit = colorDepth >= 30;

  return (
    <ApiCard
      title="Screen Color Depth"
      icon="🎨"
      status={is10Bit ? "supported" : "info"}
      statusLabel={is10Bit ? "Wide Gamut" : "Standard"}
      mdnUrl="https://developer.mozilla.org/en-US/docs/Web/API/Screen/colorDepth"
      detailTitle="Screen Color Depth — Details"
      detailContent={
        <div>
          <DetailSection heading="What this means">
            <p className="text-sm text-color5/80 leading-relaxed">
              <strong>Color Depth</strong> is the number of bits used per pixel
              as reported by the browser.
              <strong> 24-bit</strong> is standard (8 bits per RGB channel).{" "}
              <strong>30-bit+</strong> indicates a 10-bit-per-channel display
              capable of HDR content.
            </p>
          </DetailSection>
          <DetailSection heading="Browser notes">
            <ul className="text-sm text-color5/80 space-y-1 list-disc list-inside leading-relaxed">
              <li>
                Chromium/Brave reads depth from the display EDID — reports
                30-bit on 10-bit panels.
              </li>
              <li>
                Firefox and WebKitGTK (Epiphany) read from the X11/Wayland
                server, typically reporting 24-bit even on 10-bit hardware.
              </li>
            </ul>
          </DetailSection>
        </div>
      }
    >
      <DataRow
        label="Colour Depth"
        value={`${colorDepth}-bit — ${depthLabel(colorDepth)}`}
      />
      <DataRow
        label="Pixel Depth"
        value={`${pixelDepth}-bit — ${depthLabel(pixelDepth)}`}
      />
    </ApiCard>
  );
}

export default ScreenColorDepth;
