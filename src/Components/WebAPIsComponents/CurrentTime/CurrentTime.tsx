import { useState, useEffect } from "react";
import { ApiCard, DetailSection } from "../Shared/ApiCard";

const formatTime = (): string => {
  const now = new Date();
  return [now.getHours(), now.getMinutes(), now.getSeconds()]
    .map((n) => String(n).padStart(2, "0"))
    .join(":");
};

const CurrentTime = () => {
  const [time, setTime] = useState<string>(formatTime);

  useEffect(() => {
    const id = setInterval(() => setTime(formatTime()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <ApiCard
      title="Current Time"
      icon="⏰"
      category="time-locale"
      isLive
      purpose="Reads the local system clock — not a server. If the device clock is wrong, this value will be wrong too."
      status="info"
      mdnUrl="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date"
      detailTitle="Current Time — Details"
      detailContent={
        <div>
          <DetailSection heading="Source">
            <p className="text-sm text-color5/80 leading-relaxed">
              Time is read from{" "}
              <code className="text-xs bg-white/10 px-1 rounded">
                new Date()
              </code>
              , which reflects the local system clock in the browser. It is not
              fetched from a server — if your system clock is wrong, this will
              be wrong too.
            </p>
          </DetailSection>
          <DetailSection heading="Live updates">
            <p className="text-sm text-color5/80 leading-relaxed">
              This card re-reads the clock every second using{" "}
              <code className="text-xs bg-white/10 px-1 rounded">
                setInterval
              </code>
              .
            </p>
          </DetailSection>
        </div>
      }
    >
      <div
        className="flex items-baseline gap-2"
        aria-live="polite"
        aria-atomic="true"
      >
        <span className="text-2xl font-mono font-bold tracking-widest">
          {time}
        </span>
        <span className="text-xs text-color5/50 uppercase">local time</span>
      </div>
    </ApiCard>
  );
};

export default CurrentTime;
