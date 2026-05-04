import Navbar from "../Components/Navbar/Navbar";
import FeedbackDialog from "../Components/FeedbackDialog/FeedbackDialog";
import { useLocation } from "react-router-dom";
import SideMenu from "../Components/SideMenu/SideMenu";
import * as React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  const isHome = pathname === "/home";

  return (
    <div className="w-full h-full bg-color1 relative flex flex-col-reverse md:flex-row">
      {!isHome && (
        <div className="w-full md:w-20 h-16 md:h-full flex-shrink-0">
          <Navbar />
        </div>
      )}
      <main id="main-content" className="w-full h-full overflow-hidden">
        <React.Suspense
          fallback={
            <div
              role="status"
              aria-label="Loading page"
              className="w-full h-full bg-color1 flex items-center justify-center"
            >
              <span className="sr-only">Loading...</span>
            </div>
          }
        >
          {children}
        </React.Suspense>
      </main>
      <FeedbackDialog />

      <SideMenu />
    </div>
  );
};

export default Layout;
