import { useState, useEffect } from "react";
import { Card } from "primereact/card"; // Assuming PrimeReact is installed

const TimeZone = ({ baseStyle }: { baseStyle: string }) => {
  const [timezone, setTimezone] = useState<string>("");
  const [timezoneOffset, setTimezoneOffset] = useState<string>("");

  useEffect(() => {
    const getTimezone = () => {
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const offsetInMinutes = new Date().getTimezoneOffset();
      const offsetHours = Math.floor(Math.abs(offsetInMinutes) / 60)
        .toString()
        .padStart(2, "0");
      const offsetMinutes = (Math.abs(offsetInMinutes) % 60)
        .toString()
        .padStart(2, "0");
      const offsetSign = offsetInMinutes >= 0 ? "-" : "+";
      setTimezone(userTimezone);
      setTimezoneOffset(`${offsetSign}${offsetHours}:${offsetMinutes}`);
    };

    getTimezone(); // Call the function within useEffect
  }, []); // Empty dependency array to run only once on component mount

  // const cardStyle = "rounded-md"; // Card styling

  return (
    <Card
      className={baseStyle}
      title={<h2 className="font-heading">Time Zone</h2>}
      subTitle={<p className="font-subHeading">(current local time zone)</p>}
    >
      {timezone} (UTC {timezoneOffset})
    </Card>
  );
};

export default TimeZone;
