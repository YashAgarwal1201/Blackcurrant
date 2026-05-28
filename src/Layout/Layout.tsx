// src/Layout/Layout.tsx
import * as React from "react";
import { useLocation } from "react-router-dom";
import SideMenu from "@/Components/SideMenu/SideMenu";
import FeedbackDialog from "@/Components/FeedbackDialog/FeedbackDialog";
import Navbar from "@/Components/Navbar/Navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  const isHome = pathname === "/home";

  return (
    <div className="w-full h-full bg-base-100 relative flex flex-col-reverse md:flex-row">
      {!isHome && (
        <div className="w-full md:w-20 h-16 md:h-full shrink-0">
          <Navbar />
        </div>
      )}

      <main id="main-content" className="w-full h-full overflow-hidden">
        <React.Suspense
          fallback={
            <div
              role="status"
              aria-label="Loading page"
              className="w-full h-full bg-base-100 flex items-center justify-center"
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
