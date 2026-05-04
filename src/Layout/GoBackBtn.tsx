import { ChevronLeft } from "lucide-react";
import { Button } from "primereact/button";

const GoBackBtn = ({ extraHandelers }: { extraHandelers?: () => void }) => {
  const goBackBtn = () => {
    extraHandelers?.();
    window.history.back();
  };
  return (
    <Button
      icon={<ChevronLeft size={20} fontWeight={400} />}
      title="Go back"
      aria-label="GO back btn"
      onClick={() => goBackBtn()}
      className="rounded-full text-color5"
      rounded
    />
  );
};

export default GoBackBtn;
