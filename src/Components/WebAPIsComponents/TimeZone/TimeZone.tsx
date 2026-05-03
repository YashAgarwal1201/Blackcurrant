import { useState, useEffect } from "react";
import { Card } from "primereact/card"; // Assuming PrimeReact is installed
import { WEB_APIS_CARDS_BASE_STYLES } from "../../../Services/Constants";

const TimeZone = () => {
  const [timezone, setTimezone] = useState<string>("");
  const [timezoneOffset, setTimezoneOffset] = useState<string>("");

  useEffect(() => {
    const rawOffset = new Date().getTimezoneOffset();
    const absMinutes = Math.abs(rawOffset);
    const offsetHours = Math.floor(absMinutes / 60)
      .toString()
      .padStart(2, "0");
    const offsetMins = (absMinutes % 60).toString().padStart(2, "0");
    // rawOffset is NEGATIVE for east-of-UTC (e.g. IST = -330), POSITIVE for west
    const offsetSign = rawOffset <= 0 ? "+" : "-";
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    setTimezoneOffset(`UTC ${offsetSign}${offsetHours}:${offsetMins}`);
  }, []);

  return (
    <Card
      className={WEB_APIS_CARDS_BASE_STYLES}
      title={<h2 className="font-heading">Time Zone</h2>}
      subTitle={<p className="font-subHeading">(current local time zone)</p>}
    >
      {timezone} (UTC {timezoneOffset})
    </Card>
  );
};

export default TimeZone;
