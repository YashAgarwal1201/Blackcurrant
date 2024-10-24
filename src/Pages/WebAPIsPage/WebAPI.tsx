import Layout from "../../Layout/Layout";
import BatteryStatus from "../../Components/WebAPIsComponents/BatteryStatus/BatteryStatus";
import BrowserDetection from "../../Components/WebAPIsComponents/BrowserDetection/BrowserDetection";
import WindowSize from "../../Components/WebAPIsComponents/BrowserWindowSize/BrowserWindowSize";
import ColorGamutSupport from "../../Components/WebAPIsComponents/ColorGamut/ColorGamut";
import CookieStatus from "../../Components/WebAPIsComponents/CookiesEnabled/CookiesEnabled";
import CurrentDate from "../../Components/WebAPIsComponents/CurrentDate/CurrentDate";
import CurrentTime from "../../Components/WebAPIsComponents/CurrentTime/CurrentTime";
import ThemePreference from "../../Components/WebAPIsComponents/DeviceThemePreference/DeviceThemePreference";
import HdrSupportCheck from "../../Components/WebAPIsComponents/HdrSupport/HdrSupport";
import ScreenColorDepth from "../../Components/WebAPIsComponents/ScreenColorDepth/ScreenColorDepth";
import ScreenResolution from "../../Components/WebAPIsComponents/ScreenResolution/ScreenResolution";
import SpeechRecognitionSupport from "../../Components/WebAPIsComponents/SpeechRecognition/SpeechRecognition";
import SpeechSynthesisSupport from "../../Components/WebAPIsComponents/SpeechSynthesis/SpeechSynthesis";
import TimeZone from "../../Components/WebAPIsComponents/TimeZone/TimeZone";
import OsDetection from "../../Components/WebAPIsComponents/UserOS/UserOS";
import ScreenOrientation from "../../Components/WebAPIsComponents/ScreenOrientation/ScreenOrientation";

import "./WebAPI.scss";

const WebAPI = () => {
  const cardStylesBase = "h-[300px] bg-color2 text-color5 rounded-md";

  return (
    <Layout>
      <div className="custom-scrollbar w-full h-full py-2 md:py-3 lg:py-4 pl-2 md:pl-3 lg:pl-4 flex flex-col gap-y-4 sm:pa-y-6 md:gap-y-10 overflow-y-auto">
        <h1 className="text-2xl xs:text-3xl mdl:text-4xl text-color5 font-heading select-none">
          Web APIs
        </h1>
        <div className="web-apis w-full pr-2 grid grid-flow-row gap-2 md:gap-3 lg:gap-4 grid-cols-1 sm:grid-cols-2 mdl:grid-cols-3 lg:grid-cols-4 ">
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
      </div>
    </Layout>
  );
};

export default WebAPI;
