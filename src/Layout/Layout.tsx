import Navbar from "../Components/Navbar/Navbar";
import SideMenu from "../Components/SideMenu/SideMenu";
import FeedbackDialog from "../Components/FeedbackDialog/FeedbackDialog";

const Layout = ({ children }: { children: any }) => {
  return (
    <div className="w-full h-full bg-color1 relative flex flex-col md:flex-row">
      <div className="w-full md:w-20 h-16 md:h-full flex-shrink-0">
        <Navbar />
      </div>
      <div className="h-full flex-grow overflow-y-auto flex justify-center items-center">
        {children}
      </div>

      <SideMenu />
      <FeedbackDialog />
    </div>
  );
};

export default Layout;
