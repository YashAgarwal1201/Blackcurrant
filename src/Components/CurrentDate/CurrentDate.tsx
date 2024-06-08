import React, { useState, useEffect } from "react";
import { Card } from "primereact/card"; // Assuming PrimeReact is installed

const CurrentDate: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<string>("");

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.toLocaleString("en-US", { month: "long" }); // Full month name
      const day = now.getDate();
      const ordinalSuffix = getOrdinalSuffix(day); // Get ordinal suffix for the day
      setCurrentDate(`${day}${ordinalSuffix} of ${month}, ${year}`);
    };

    // Update date when component mounts
    updateDate();

    // Cleanup interval on component unmount
    return () => {};
  }, []); // Empty dependency array to run only once on component mount

  // Function to get the ordinal suffix for the day
  const getOrdinalSuffix = (day: number) => {
    if (day >= 11 && day <= 13) {
      return "th";
    }
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

  const cardStyle = "rounded-md"; // Card styling

  return (
    <Card
      className={cardStyle}
      title={<h2>Current Date</h2>}
      subTitle={<p></p>}
    >
      <p>{currentDate}</p>
    </Card>
  );
};

export default CurrentDate;
