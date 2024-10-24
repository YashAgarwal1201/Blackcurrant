import { Card } from "primereact/card";

const ScreenResolution = ({ baseStyle }: { baseStyle: string }) => {
  const getDeviceResolution = () => {
    // Calculate the exact resolution
    const width = window.screen.width * window.devicePixelRatio;
    const height = window.screen.height * window.devicePixelRatio;

    // Format to the nearest whole number to reduce error
    const exactWidth = Math.round(width);
    const exactHeight = Math.round(height);

    return `${exactWidth} x ${exactHeight}`;
  };

  return (
    <Card
      className={baseStyle}
      title={<h2 className="font-heading">Screen Resolution</h2>}
      subTitle={<p className="font-subHeading">(approx. value)</p>}
    >
      {getDeviceResolution()}
    </Card>
  );
};

export default ScreenResolution;
