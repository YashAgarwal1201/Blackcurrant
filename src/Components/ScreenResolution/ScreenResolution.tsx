import { Card } from "primereact/card";

const ScreenResolution = ({ baseStyle }: { baseStyle: string }) => {
  // const cardStyle = "rounded-md";

  return (
    <Card
      className={baseStyle}
      title={<h2 className="font-heading">Screen Resolution</h2>}
      subTitle={<p className="font-subHeading">(approx. value)</p>}
    >
      {window.screen.width * window.devicePixelRatio} *{" "}
      {window.screen.height * window.devicePixelRatio}
    </Card>
  );
};

export default ScreenResolution;
