import Navbar from "../Components/Navbar/Navbar";
import FeedbackDialog from "../Components/FeedbackDialog/FeedbackDialog";
import { useLocation } from "react-router-dom";
import SideMenu from "../Components/SideMenu/SideMenu";

const Layout = ({ children }: { children: any }) => {
  const { pathname } = useLocation();
  const isHome = pathname === "/home";

  return (
    <div className="w-full h-full bg-color1 relative flex flex-col-reverse md:flex-row">
      {!isHome && (
        <div className="w-full md:w-20 h-16 md:h-full flex-shrink-0">
          <Navbar />
        </div>
      )}
      <div className="w-full h-full overflow-hidden">{children}</div>
      <FeedbackDialog />

      <SideMenu />
    </div>
  );
};

export default Layout;
