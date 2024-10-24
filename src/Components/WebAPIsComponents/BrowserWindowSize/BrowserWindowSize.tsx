import { useState, useEffect } from "react";
import { Card } from "primereact/card";

const WindowSize = ({ baseStyle }: { baseStyle: string }) => {
  const getWindowSize = () => {
    const width = window.innerWidth * window.devicePixelRatio;
    const height = window.innerHeight * window.devicePixelRatio;
    return `${Math.round(width)} x ${Math.round(height)}`;
  };

  const [windowSize, setWindowSize] = useState(getWindowSize());

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(getWindowSize());
    };

    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Card
      className={baseStyle}
      title={<h2 className="font-heading">Window Size</h2>}
      subTitle={<p className="font-subHeading">(exact value)</p>}
    >
      {windowSize}
    </Card>
  );
};

export default WindowSize;
