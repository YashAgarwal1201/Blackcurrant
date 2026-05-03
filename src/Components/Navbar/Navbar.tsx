import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import useNavStore from "../../Services/Stores/navStore";
import { Home, Menu } from "lucide-react";

const Navbar = () => {
  const { toggleSideMenu } = useNavStore();

  return (
    <div className="header-card w-full md:w-[64px] h-[56px] md:h-full p-1 flex flex-row md:flex-col justify-between items-center bg-color1 font-content text-base xs:text-lg md:text-xl lg:text-2xl select-none">
      <div className="w-fit md:w-full h-full md:h-fit flex flex-row md:flex-col items-center gap-2">
        <Link
          title="Go to home page"
          aria-label="Home page btn"
          to={"/home"}
          className="w-auto md:w-full h-full md:h-auto aspect-square flex items-center justify-center rounded-2xl bg-color2 text-color4"
        >
          <Home size={16} />
        </Link>
      </div>

      <div className="w-auto md:!w-full h-full md:h-auto flex items-center text-color4">
        <Button
          title="Open side menu"
          aria-label="Side menu btn"
          onClick={() => toggleSideMenu()}
          className="w-auto md:!w-full h-full md:h-auto aspect-square flex items-center justify-center rounded-2xl !bg-color2"
        >
          <Menu size={16} />
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
