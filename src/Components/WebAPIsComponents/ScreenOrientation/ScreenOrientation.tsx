import { useState, useEffect } from "react";
import { Card } from "primereact/card"; // Assuming PrimeReact is installed
import { WEB_APIS_CARDS_BASE_STYLES } from "../../../Services/Constants";

const ScreenOrientation = () => {
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

  // const cardStyle = "rounded-md"; // Card styling

  return (
    <Card
      className={WEB_APIS_CARDS_BASE_STYLES}
      title={<h2 className="font-heading">Screen Orientation</h2>}
      subTitle={<p className="font-subHeading">(current orientation)</p>}
    >
      {orientation}
    </Card>
  );
};

export default ScreenOrientation;
