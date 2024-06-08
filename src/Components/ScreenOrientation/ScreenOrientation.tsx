import React, { useState, useEffect } from "react";
import { Card } from "primereact/card"; // Assuming PrimeReact is installed

const ScreenOrientation: React.FC = () => {
  const [orientation, setOrientation] = useState<string>("");

  useEffect(() => {
    const handleOrientationChange = () => {
      const orientationType = window.screen.orientation.type;
      setOrientation(orientationType);
    };

    // Initial set
    handleOrientationChange();

    // Add event listener for orientation changes
    window.screen.orientation.addEventListener(
      "change",
      handleOrientationChange
    );

    // Cleanup event listener on component unmount
    return () => {
      window.screen.orientation.removeEventListener(
        "change",
        handleOrientationChange
      );
    };
  }, []); // Empty dependency array to run only once on component mount

  const cardStyle = "rounded-md"; // Card styling

  return (
    <Card
      className={cardStyle}
      title={<h2>Screen Orientation</h2>}
      subTitle={<p></p>}
    >
      {orientation}
    </Card>
  );
};

export default ScreenOrientation;
