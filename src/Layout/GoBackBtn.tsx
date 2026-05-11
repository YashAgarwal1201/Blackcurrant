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
      aria-label="Go back btn"
      onClick={() => goBackBtn()}
      className="rounded-full text-base-content bg-transparent border-transparent"
      rounded
    />
  );
};

export default GoBackBtn;
