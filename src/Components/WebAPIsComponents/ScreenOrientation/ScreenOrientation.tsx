import { useState, useEffect } from "react";
import { ApiCard, DataRow, DetailSection } from "../Shared/ApiCard";

const ORIENTATION_LABELS: Record<string, { label: string; icon: string }> = {
  "portrait-primary": { label: "Portrait", icon: "📱" },
  "portrait-secondary": { label: "Portrait (flipped)", icon: "📱" },
  "landscape-primary": { label: "Landscape", icon: "🖥️" },
  "landscape-secondary": { label: "Landscape (flipped)", icon: "🖥️" },
};

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

const ScreenOrientationCard = () => {
  const [orientation, setOrientation] = useState<string>(getOrientation);

  useEffect(() => {
    const handleChange = () => setOrientation(getOrientation());
    window.screen.orientation?.addEventListener("change", handleChange);
    window.addEventListener("orientationchange", handleChange);
    window.addEventListener("resize", handleChange);
    return () => {
      window.screen.orientation?.removeEventListener("change", handleChange);
      window.removeEventListener("orientationchange", handleChange);
      window.removeEventListener("resize", handleChange);
    };
  }, []);

  const info = ORIENTATION_LABELS[orientation] ?? {
    label: orientation,
    icon: "🔄",
  };

  return (
    <ApiCard
      title="Screen Orientation"
      icon="🔄"
      category="display"
      isLive
      purpose="Reflects the current display rotation in real time. Essential for responsive canvas layouts and rotation-aware mobile UX."
      status="info"
      mdnUrl="https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation"
      detailTitle="Screen Orientation — Details"
      detailContent={
        <div>
          <DetailSection heading="Orientation Types">
            <ul className="text-sm text-color5/80 space-y-1 list-disc list-inside leading-relaxed">
              <li>
                <strong>portrait-primary</strong> — upright, natural position
              </li>
              <li>
                <strong>portrait-secondary</strong> — upside down
              </li>
              <li>
                <strong>landscape-primary</strong> — rotated 90° left
              </li>
              <li>
                <strong>landscape-secondary</strong> — rotated 90° right
              </li>
            </ul>
          </DetailSection>
          <DetailSection heading="Desktop behaviour">
            <p className="text-sm text-color5/80 leading-relaxed">
              Desktop browsers always report <strong>landscape-primary</strong>{" "}
              since the display orientation is fixed. Rotation detection is most
              meaningful on mobile and tablet devices.
            </p>
          </DetailSection>
        </div>
      }
    >
      <DataRow
        label="Orientation"
        value={
          <span>
            {info.icon} {info.label}
          </span>
        }
      />
      <DataRow label="Raw value" value={orientation} mono copyable />
    </ApiCard>
  );
};

export default ScreenOrientationCard;
