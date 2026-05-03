import { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { WEB_APIS_CARDS_BASE_STYLES } from "../../../Services/Constants";

const CurrentTime = () => {
  const formatTime = (): string => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  // Lazy initializer — called immediately on mount, no blank flash
  const [currentTime, setCurrentTime] = useState<string>(formatTime);

  useEffect(() => {
    const intervalId = setInterval(() => setCurrentTime(formatTime()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Card
      className={WEB_APIS_CARDS_BASE_STYLES}
      title={<h2 className="font-heading">Current Time</h2>}
      subTitle={<p className="font-subHeading">(current local time)</p>}
    >
      <p>{currentTime}</p>
    </Card>
  );
};

export default CurrentTime;
