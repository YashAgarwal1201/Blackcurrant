import { useState, useEffect } from "react";
import { ApiCard, DataRow, DetailSection } from "../Shared/ApiCard";

const getTimeZoneInfo = () => {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const rawOffset = new Date().getTimezoneOffset();
  const totalMins = Math.abs(rawOffset);
  const sign = rawOffset <= 0 ? "+" : "-";
  const hours = String(Math.floor(totalMins / 60)).padStart(2, "0");
  const mins = String(totalMins % 60).padStart(2, "0");
  const offset = `UTC ${sign}${hours}:${mins}`;
  const locale =
    Intl.DateTimeFormat().resolvedOptions().locale ?? navigator.language;
  return { tz, offset, locale };
};

const TimeZone = () => {
  const [info, setInfo] = useState(getTimeZoneInfo);

  useEffect(() => {
    const handleVisibility = () => {
      if (!document.hidden) setInfo(getTimeZoneInfo());
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  return (
    <ApiCard
      title="Time Zone"
      icon="🌍"
      category="time-locale"
      purpose="The IANA timezone and UTC offset reported by the browser. Use this to default datetime pickers and localise server-side timestamps without asking the user."
      status="info"
      mdnUrl="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/resolvedOptions"
      detailTitle="Time Zone — Details"
      detailContent={
        <div>
          <DetailSection heading="How it's detected">
            <p className="text-sm text-color5/80 leading-relaxed">
              The IANA timezone identifier (e.g.{" "}
              <code className="text-xs bg-white/10 px-1 rounded">
                Asia/Kolkata
              </code>
              ) comes from{" "}
              <code className="text-xs bg-white/10 px-1 rounded">
                Intl.DateTimeFormat().resolvedOptions().timeZone
              </code>
              . The UTC offset is computed from{" "}
              <code className="text-xs bg-white/10 px-1 rounded">
                Date.prototype.getTimezoneOffset()
              </code>
              , which returns minutes west of UTC (negative = east).
            </p>
          </DetailSection>
          <DetailSection heading="DST note">
            <p className="text-sm text-color5/80 leading-relaxed">
              The offset shown is the <strong>current</strong> offset including
              any active Daylight Saving Time adjustment. It may change when DST
              starts or ends.
            </p>
          </DetailSection>
        </div>
      }
    >
      <DataRow label="IANA Timezone" value={info.tz} mono copyable />
      <DataRow label="UTC Offset" value={info.offset} copyable />
      <DataRow label="Locale" value={info.locale} copyable />
    </ApiCard>
  );
};

export default TimeZone;
