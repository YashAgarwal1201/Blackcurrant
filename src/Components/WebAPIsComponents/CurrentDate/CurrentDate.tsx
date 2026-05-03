import { useState, useEffect } from "react";
import { ApiCard, DetailSection } from "../Shared/ApiCard";

const getOrdinal = (day: number): string => {
  if (day >= 11 && day <= 13) return "th";
  return ["th", "st", "nd", "rd"][day % 10] ?? "th";
};

const formatDate = () => {
  const now = new Date();
  const day = now.getDate();
  const month = now.toLocaleString("en-US", { month: "long" });
  const year = now.getFullYear();
  const weekday = now.toLocaleString("en-US", { weekday: "long" });
  return {
    display: `${day}${getOrdinal(day)} ${month} ${year}`,
    weekday,
  };
};

const CurrentDate = () => {
  const [date, setDate] = useState(formatDate);

  useEffect(() => {
    const id = setInterval(() => setDate(formatDate()), 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <ApiCard
      title="Current Date"
      icon="📅"
      status="info"
      mdnUrl="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date"
      detailTitle="Current Date — Details"
      detailContent={
        <div>
          <DetailSection heading="Source">
            <p className="text-sm text-color5/80 leading-relaxed">
              Date is read from the browser's local system clock via{" "}
              <code className="text-xs bg-white/10 px-1 rounded">
                new Date()
              </code>
              . It reflects the device's local timezone and system clock — not a
              network time source.
            </p>
          </DetailSection>
        </div>
      }
    >
      <div className="flex flex-col gap-1">
        <span className="text-xl font-semibold">{date.display}</span>
        <span className="text-sm text-color5/60">{date.weekday}</span>
      </div>
    </ApiCard>
  );
};

export default CurrentDate;
