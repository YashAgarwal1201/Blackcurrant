// src/Pages/WebAPIsPage/WebAPI.tsx

import { useMemo } from "react";
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
import NavigatorLanguage from "../../Components/WebAPIsComponents/NavigatorLanguage/NavigatorLanguage";
import NetworkInfo from "../../Components/WebAPIsComponents/NetworkComponent/NetworkComponent";
import OnlineStatus from "../../Components/WebAPIsComponents/OnlineStatus/OnlineStatus";
import DeviceMemory from "../../Components/WebAPIsComponents/DeviceMemory/DeviceMemory";
import CpuConcurrency from "../../Components/WebAPIsComponents/CpuConcurrency/CpuConcurrency";
import TouchSupport from "../../Components/WebAPIsComponents/TouchSupport/TouchSupport";
import StorageQuota from "../../Components/WebAPIsComponents/StorageQuota/StorageQuota";
import ServiceWorkerSupport from "../../Components/WebAPIsComponents/ServiceWorkerSupport/ServiceWorkerSupport";
import ClipboardApiCard from "../../Components/WebAPIsComponents/ClipboardApi/ClipboardApi";
import NotificationPermission from "../../Components/WebAPIsComponents/NotificationPermission/NotificationPermission";
import GeolocationSupport from "../../Components/WebAPIsComponents/GeolocationSupport/GeolocationSupport";
import VibrationApi from "../../Components/WebAPIsComponents/VibrationApi/VibrationApi";
import WebGLInfo from "../../Components/WebAPIsComponents/WebGLInfo/WebGLInfo";
import PageVisibility from "../../Components/WebAPIsComponents/PageVisibility/PageVisibility";
import PrefersReducedMotion from "../../Components/WebAPIsComponents/PrefersReducedMotion/PrefersReducedMotion";
import PrefersContrast from "../../Components/WebAPIsComponents/PrefersContrast/PrefersContrast";
import ForcedColors from "../../Components/WebAPIsComponents/ForcedColors/ForcedColors";

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

import { useWebApisStore } from "../../Services/Stores/webApisStore";
import {
  WEB_API_CATEGORIES,
  CARD_CATEGORY_MAP,
  type WebApiCategory,
  WebApiCategoryMeta,
} from "../../Services/webApiCategories";

import GoBackBtn from "../../Layout/GoBackBtn";
import "./WebAPI.scss";
import { Search, X } from "lucide-react";

const CARD_REGISTRY: {
  cardKey: string;
  searchTerms: string;
  component: React.ReactNode;
}[] = [
  {
    cardKey: "screenColorDepth",
    searchTerms: "screen color depth pixel bit display",
    component: <ScreenColorDepth />,
  },
  {
    cardKey: "screenResolution",
    searchTerms: "screen resolution pixel hardware logical css",
    component: <ScreenResolution />,
  },
  {
    cardKey: "screenOrientation",
    searchTerms: "screen orientation landscape portrait",
    component: <ScreenOrientation />,
  },
  {
    cardKey: "windowSize",
    searchTerms: "window size viewport css pixels rendered",
    component: <WindowSize />,
  },
  {
    cardKey: "colorGamut",
    searchTerms: "color gamut p3 srgb display wide",
    component: <ColorGamutSupport />,
  },
  {
    cardKey: "hdrSupport",
    searchTerms: "hdr high dynamic range display detection",
    component: <HdrSupportCheck />,
  },
  {
    cardKey: "webGLInfo",
    searchTerms: "webgl gpu renderer vendor opengl hardware acceleration",
    component: <WebGLInfo />,
  },
  {
    cardKey: "currentTime",
    searchTerms: "current time local clock live",
    component: <CurrentTime />,
  },
  {
    cardKey: "currentDate",
    searchTerms: "current date today calendar",
    component: <CurrentDate />,
  },
  {
    cardKey: "timeZone",
    searchTerms: "timezone iana utc offset locale",
    component: <TimeZone />,
  },
  {
    cardKey: "navigatorLanguage",
    searchTerms: "navigator language locale bcp47 i18n accept-language",
    component: <NavigatorLanguage />,
  },
  {
    cardKey: "batteryStatus",
    searchTerms: "battery status level charging hardware",
    component: <BatteryStatus />,
  },
  {
    cardKey: "deviceMemory",
    searchTerms: "device memory ram hardware gigabytes",
    component: <DeviceMemory />,
  },
  {
    cardKey: "cpuConcurrency",
    searchTerms: "cpu cores threads hardware concurrency worker",
    component: <CpuConcurrency />,
  },
  {
    cardKey: "touchSupport",
    searchTerms: "touch pointer coarse fine max touch points",
    component: <TouchSupport />,
  },
  {
    cardKey: "cookieStatus",
    searchTerms: "cookie enabled browser storage access",
    component: <CookieStatus />,
  },
  {
    cardKey: "browserDetection",
    searchTerms: "browser detection brave chrome engine blink user agent",
    component: <BrowserDetection />,
  },
  {
    cardKey: "osDetection",
    searchTerms: "os operating system linux windows mac detection",
    component: <OsDetection />,
  },
  {
    cardKey: "storageQuota",
    searchTerms: "storage quota usage indexeddb cache estimate",
    component: <StorageQuota />,
  },
  {
    cardKey: "serviceWorkerSupport",
    searchTerms: "service worker pwa offline push background sync",
    component: <ServiceWorkerSupport />,
  },
  {
    cardKey: "clipboardApi",
    searchTerms: "clipboard copy paste read write permission",
    component: <ClipboardApiCard />,
  },
  {
    cardKey: "notificationPermission",
    searchTerms: "notification permission push granted denied",
    component: <NotificationPermission />,
  },
  {
    cardKey: "speechRecognition",
    searchTerms: "speech recognition voice api microphone",
    component: <SpeechRecognitionSupport />,
  },
  {
    cardKey: "speechSynthesis",
    searchTerms: "speech synthesis voice tts text to speech",
    component: <SpeechSynthesisSupport />,
  },
  {
    cardKey: "geolocationSupport",
    searchTerms: "geolocation gps location coordinates permission",
    component: <GeolocationSupport />,
  },
  {
    cardKey: "vibrationApi",
    searchTerms: "vibration haptic feedback mobile",
    component: <VibrationApi />,
  },
  {
    cardKey: "onlineStatus",
    searchTerms: "online offline network status connection live",
    component: <OnlineStatus />,
  },
  {
    cardKey: "networkInfo",
    searchTerms:
      "network info connection speed downlink rtt save data bandwidth",
    component: <NetworkInfo />,
  },
  {
    cardKey: "pageVisibility",
    searchTerms: "page visibility hidden visible tab background",
    component: <PageVisibility />,
  },
  {
    cardKey: "themePreference",
    searchTerms: "theme dark light mode preference system",
    component: <ThemePreference />,
  },
  {
    cardKey: "prefersReducedMotion",
    searchTerms: "reduced motion animation accessibility vestibular",
    component: <PrefersReducedMotion />,
  },
  {
    cardKey: "prefersContrast",
    searchTerms: "contrast accessibility high contrast low vision",
    component: <PrefersContrast />,
  },
  {
    cardKey: "forcedColors",
    searchTerms: "forced colors windows high contrast mode os",
    component: <ForcedColors />,
  },
];

if (import.meta.env.DEV) {
  CARD_REGISTRY.forEach(({ cardKey }) => {
    if (!(cardKey in CARD_CATEGORY_MAP)) {
      console.error(
        `[WebAPI] Card key "${cardKey}" is in CARD_REGISTRY but missing from CARD_CATEGORY_MAP.\n` +
          `Add it to src/Services/webApiCategories.ts to fix grouping.`,
      );
    }
  });
}

const WebAPI = () => {
  const {
    activeCategory,
    searchQuery,
    setActiveCategory,
    setSearchQuery,
    resetFilters,
  } = useWebApisStore();

  const filteredCards = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return CARD_REGISTRY.filter(({ cardKey, searchTerms }) => {
      const matchesCategory =
        activeCategory === "all" ||
        CARD_CATEGORY_MAP[cardKey] === activeCategory;
      const matchesSearch = q === "" || searchTerms.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const groupedCards = useMemo(() => {
    if (activeCategory !== "all") {
      return [
        {
          category: WEB_API_CATEGORIES.find((c) => c.id === activeCategory)!,
          cards: filteredCards,
        },
      ];
    }
    const groups: Map<WebApiCategory, (typeof CARD_REGISTRY)[number][]> =
      new Map();
    filteredCards.forEach((card) => {
      const cat = CARD_CATEGORY_MAP[card.cardKey] ?? "browser-environment";
      if (!groups.has(cat)) groups.set(cat, []);
      groups.get(cat)!.push(card);
    });
    return WEB_API_CATEGORIES.filter((c) => c.id !== "all")
      .map((catMeta) => ({
        category: catMeta,
        cards: groups.get(catMeta.id) ?? [],
      }))
      .filter((g) => g.cards.length > 0);
  }, [filteredCards, activeCategory]);

  const totalVisible = filteredCards.length;
  const totalCards = CARD_REGISTRY.length;

  return (
    <Layout>
      <div className="web-apis-page custom-scrollbar w-full h-full py-2 md:py-3 lg:py-4 pl-2 md:pl-3 lg:pl-4 flex flex-col gap-y-4 md:gap-y-6 overflow-y-auto">
        {/* Page header */}
        <div className="flex flex-col gap-y-1 pr-2 md:pr-3 lg:pr-4">
          <div className="flex items-center gap-x-1">
            <GoBackBtn extraHandelers={() => resetFilters()} />
            <h1 className="text-2xl xs:text-3xl mdl:text-4xl text-primary font-heading select-none">
              Browser Vitals
            </h1>
          </div>
          <p className="text-base text-neutral-content font-content">
            Live browser environment information powered by native Web APIs.
          </p>
        </div>

        {/* Search + filter bar */}
        <div className="web-apis-controls flex flex-col gap-2 pr-2 md:pr-3 lg:pr-4">
          <div className="flex items-center gap-2">
            {/* Search input */}
            <div className="web-apis-search relative grow">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-content text-sm pointer-events-none select-none">
                <Search size={16} />
              </span>
              <InputText
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search APIs…"
                aria-label="Search Web API cards"
                className="w-full bg-base-200! text-base-content! placeholder:text-neutral-content text-base font-content rounded-lg pl-9 pr-8 py-2.5 border! border-neutral! outline-none focus:border-primary! transition-colors"
              />
              {searchQuery && (
                <Button
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className="absolute right-0 top-1/2 -translate-y-1/2 h-full text-neutral-content! transition-colors text-sm leading-none bg-transparent border-transparent rounded-r-lg"
                >
                  <X size={16} />
                </Button>
              )}
            </div>

            {/* Category dropdown */}
            <Dropdown
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.value as WebApiCategory)}
              options={WEB_API_CATEGORIES}
              optionLabel="label"
              optionValue="id"
              aria-label="Filter by category"
              className={`h-full shrink-0 bg-base-200! *:text-base-content! text-base! font-content! rounded-lg! border! transition-colors ${
                activeCategory !== "all" ? "border-primary!" : "border-neutral!"
              }`}
              panelClassName="bg-base-200 border border-neutral rounded-lg shadow-lg py-2 px-2"
              itemTemplate={(value: WebApiCategoryMeta) => (
                <span className="font-content">{value.label}</span>
              )}
              valueTemplate={(value: WebApiCategoryMeta) => (
                <span className="text-base-content font-content">
                  {value.label}
                </span>
              )}
            />
          </div>

          {/* Results count */}
          <p
            className="text-xs md:text-sm text-neutral-content font-content select-none"
            aria-live="polite"
          >
            {searchQuery || activeCategory !== "all"
              ? `Showing ${totalVisible} of ${totalCards} APIs`
              : `${totalCards} APIs across ${WEB_API_CATEGORIES.length - 1} categories`}
          </p>
        </div>

        {/* Card groups */}
        <div className="flex flex-col gap-y-8 pr-2 md:pr-3 lg:pr-4 pb-4">
          {groupedCards.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
              <span className="text-4xl" aria-hidden="true">
                🔍
              </span>
              <p className="text-base-content text-sm font-content">
                No APIs match your search.
              </p>
              <Button
                onClick={resetFilters}
                className="text-sm px-3 py-1.5 text-primary! underline underline-offset-2 transition-colors font-content"
              >
                Clear filters
              </Button>
            </div>
          ) : (
            groupedCards.map(({ category, cards }) => (
              <section key={category.id} aria-labelledby={`cat-${category.id}`}>
                {(activeCategory === "all" || groupedCards.length > 1) && (
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-base" aria-hidden="true">
                      {category.icon}
                    </span>
                    <h2
                      id={`cat-${category.id}`}
                      className="text-lg md:text-xl font-semibold text-base-content font-heading tracking-widest uppercase"
                    >
                      {category.label}
                    </h2>
                    <span className="text-xs text-neutral-content font-content">
                      ({cards.length})
                    </span>
                    {/* Separator line — uses neutral token so it adapts to light/dark */}
                    <div
                      className="flex-1 h-px bg-neutral/40 ml-1"
                      aria-hidden="true"
                    />
                  </div>
                )}

                <div className="web-apis-grid grid gap-2 md:gap-3 lg:gap-4 grid-cols-1 sm:grid-cols-2 mdl:grid-cols-3 lg:grid-cols-4">
                  {cards.map(({ cardKey, component }) => (
                    <div key={cardKey}>{component}</div>
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default WebAPI;
