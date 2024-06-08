import { Card } from "primereact/card";

const ScreenResolution = () => {
  const cardStyle = "rounded-md";

  return (
    <Card
      className={cardStyle}
      title={<h2>Screen Resolution</h2>}
      subTitle={<p>(approx. value)</p>}
    >
      {window.screen.width * window.devicePixelRatio} *{" "}
      {window.screen.height * window.devicePixelRatio}
    </Card>
  );
};

export default ScreenResolution;
