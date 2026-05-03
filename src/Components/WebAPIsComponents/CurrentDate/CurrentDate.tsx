import { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { WEB_APIS_CARDS_BASE_STYLES } from "../../../Services/Constants";

const getOrdinalSuffix = (day: number): string => {
  if (day >= 11 && day <= 13) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

const formatDate = (): string => {
  const now = new Date();
  const day = now.getDate();
  const month = now.toLocaleString("en-US", { month: "long" });
  const year = now.getFullYear();
  return `${day}${getOrdinalSuffix(day)} of ${month}, ${year}`;
};

const CurrentDate = () => {
  // Lazy initializer — populated before first paint
  const [currentDate, setCurrentDate] = useState<string>(formatDate);

  useEffect(() => {
    // Re-check every 60 seconds — handles midnight roll-over without hammering CPU
    const intervalId = setInterval(() => setCurrentDate(formatDate()), 60_000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Card
      className={WEB_APIS_CARDS_BASE_STYLES}
      title={<h2 className="font-heading">Current Date</h2>}
      subTitle={<p className="font-subHeading">(current local date)</p>}
    >
      <p>{currentDate}</p>
    </Card>
  );
};

export default CurrentDate;
