import React, { useState, useEffect } from "react";
import { Card } from "primereact/card"; // Assuming PrimeReact is installed

const CurrentTime: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    };

    // Update time every second
    const intervalId = setInterval(updateTime, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array to run only once on component mount

  const cardStyle = "rounded-md"; // Card styling

  return (
    <Card
      className={cardStyle}
      title={<h2>Current Time</h2>}
      subTitle={<p></p>}
    >
      <p>{currentTime}</p>
    </Card>
  );
};

export default CurrentTime;
