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
import BatteryStatus from "../../Components/BatteryStatus/BatteryStatus";
import SpeechRecognitionSupport from "../../Components/SpeechRecognition/SpeechRecognition";
import SpeechSynthesisSupport from "../../Components/SpeechSynthesis/SpeechSynthesis";
import HdrSupportCheck from "../../Components/HdrSupport/HdrSupport";
import ColorGamutSupport from "../../Components/ColorGamut/ColorGamut";
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
      <ContextMenu model={items} ref={cm} />
      <div
        className="w-full h-full p-1 xs:p-2 md:p-3 lg:p-4 grid grid-flow-row gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 overflow-y-auto"
        onContextMenu={(e: any) => cm.current?.show(e)}
      >
        <ScreenColorDepth baseStyle={cardStylesBase} />
        <ScreenResolution baseStyle={cardStylesBase} />
        <ScreenOrientation baseStyle={cardStylesBase} />

        <CookieStatus baseStyle={cardStylesBase} />

        <CurrentTime baseStyle={cardStylesBase} />
        <CurrentDate baseStyle={cardStylesBase} />
        <TimeZone baseStyle={cardStylesBase} />
        <BatteryStatus baseStyle={cardStylesBase} />

        <SpeechRecognitionSupport baseStyle={cardStylesBase} />
        <SpeechSynthesisSupport baseStyle={cardStylesBase} />

        <HdrSupportCheck baseStyle={cardStylesBase} />
        <ColorGamutSupport baseStyle={cardStylesBase} />
      </div>
    </Layout>
  );
};

export default LandingPage;
