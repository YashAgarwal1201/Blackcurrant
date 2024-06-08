import { useRef } from "react";
import Layout from "../../Layout/Layout";
// import { useAppContext } from "../../Services/AppContext";
import "./HomePage.scss";
import { ContextMenu } from "primereact/contextmenu";
import ScreenColorDepth from "../../Components/ScreenColorDepth/ScreenColorDepth";
import ScreenResolution from "../../Components/ScreenResolution/ScreenResolution";
import ScreenOrientation from "../../Components/ScreenOrientation/ScreenOrientation";
import CookieStatus from "../../Components/CookiesEnabled/CookiesEnabled";
import CurrentTime from "../../Components/CurrentTime/CurrentTime";
import CurrentDate from "../../Components/CurrentDate/CurrentDate";
import TimeZone from "../../Components/TimeZone/TimeZone";
// import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  // const navigate = useNavigate();
  // const { showToast } = useAppContext();

  const cm = useRef<ContextMenu>(null);
  const items = [
    {
      label: "Reload Project",
      icon: <span className="pi pi-refresh"></span>,
      command: () => window?.location?.reload(),
    },
    // {
    //   label: "Change Wallpaper",
    //   icon: <span className="material-symbols-rounded">wallpaper</span>,
    //   command: () =>
    //     showToast("info", "Info", "This feature is under construction."),
    // },
  ];

  return (
    <Layout>
      <ContextMenu model={items} ref={cm} />
      <div
        className="w-full h-full p-1 xs:p-2 md:p-3 lg:p-4 grid grid-flow-row gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 overflow-y-auto"
        onContextMenu={(e: any) => cm.current?.show(e)}
      >
        <ScreenColorDepth />
        <ScreenResolution />
        <ScreenOrientation />

        <CookieStatus />

        <CurrentTime />
        <CurrentDate />
        <TimeZone />
      </div>
    </Layout>
  );
};

export default LandingPage;
