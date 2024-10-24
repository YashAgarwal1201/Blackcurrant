import { useRef } from "react";
import Layout from "../../Layout/Layout";
// import { useAppContext } from "../../Services/AppContext";
import "./HomePage.scss";
import { ContextMenu } from "primereact/contextmenu";
import ScreenColorDepth from "../../Components/WebAPIsComponents/ScreenColorDepth/ScreenColorDepth";
import ScreenResolution from "../../Components/WebAPIsComponents/ScreenResolution/ScreenResolution";
import ScreenOrientation from "../../Components/WebAPIsComponents/ScreenOrientation/ScreenOrientation";
import CookieStatus from "../../Components/WebAPIsComponents/CookiesEnabled/CookiesEnabled";
import CurrentTime from "../../Components/WebAPIsComponents/CurrentTime/CurrentTime";
import CurrentDate from "../../Components/WebAPIsComponents/CurrentDate/CurrentDate";
import TimeZone from "../../Components/WebAPIsComponents/TimeZone/TimeZone";
import BatteryStatus from "../../Components/WebAPIsComponents/BatteryStatus/BatteryStatus";
import SpeechRecognitionSupport from "../../Components/WebAPIsComponents/SpeechRecognition/SpeechRecognition";
import SpeechSynthesisSupport from "../../Components/WebAPIsComponents/SpeechSynthesis/SpeechSynthesis";
import HdrSupportCheck from "../../Components/WebAPIsComponents/HdrSupport/HdrSupport";
import ColorGamutSupport from "../../Components/WebAPIsComponents/ColorGamut/ColorGamut";
import WindowSize from "../../Components/WebAPIsComponents/BrowserWindowSize/BrowserWindowSize";
import ThemePreference from "../../Components/WebAPIsComponents/DeviceThemePreference/DeviceThemePreference";
import BrowserDetection from "../../Components/WebAPIsComponents/BrowserDetection/BrowserDetection";
import OsDetection from "../../Components/WebAPIsComponents/UserOS/UserOS";
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

  const cardStylesBase = "h-[300px] bg-color4 text-color1 rounded-md";

  return (
    <Layout>
      {/* <ContextMenu model={items} ref={cm} /> */}
      <div
        className="hidden custom-scrollbar w-full h-full p-1 xs:p-2 md:p-3 lg:p-4 bg-color2 rounded-xl border-2 border-color2 grid grid-flow-row gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 overflow-y-auto"
        // onContextMenu={(e: any) => cm.current?.show(e)}
      >
        <ScreenColorDepth baseStyle={cardStylesBase} />
        <ScreenResolution baseStyle={cardStylesBase} />
        <ScreenOrientation baseStyle={cardStylesBase} />
        <WindowSize baseStyle={cardStylesBase} />

        <CookieStatus baseStyle={cardStylesBase} />

        <CurrentTime baseStyle={cardStylesBase} />
        <CurrentDate baseStyle={cardStylesBase} />
        <TimeZone baseStyle={cardStylesBase} />
        <BatteryStatus baseStyle={cardStylesBase} />

        <SpeechRecognitionSupport baseStyle={cardStylesBase} />
        <SpeechSynthesisSupport baseStyle={cardStylesBase} />

        <HdrSupportCheck baseStyle={cardStylesBase} />
        <ColorGamutSupport baseStyle={cardStylesBase} />
        <ThemePreference baseStyle={cardStylesBase} />

        <BrowserDetection baseStyle={cardStylesBase} />
        <OsDetection baseStyle={cardStylesBase} />
      </div>
    </Layout>
  );
};

export default LandingPage;
