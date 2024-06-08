// import React from "react";
import { useEffect, useState } from "react";
// import DockComponent from "../Components/Dock/Dock";
import Header from "../Components/Header/Header";
// import ShowAllAppsComponent from "../Components/ShowAllAppsComponent/ShowAllAppsComponent";
// import SettingsDialog from "../Components/SettingsDialog/SettingsDialog";

const Layout = ({ children }: { children: any }) => {
  const [showContent, setShowContent] = useState<boolean>(false);

  useEffect(() => {
    setShowContent(true);
  }, []);

  return (
    <div className="w-full h-full bg-color3 relative">
      <div className="h-full">
        <Header />
        <div
          className={`w-full h-[calc(100%-32px)] md:h-[calc(100%-40px)] lg:h-[calc(100%-48px)] transition-all duration-1000 transform ${
            showContent
              ? "translate-y-0 opacity-100"
              : "-translate-y-full opacity-0"
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
