// src/Services/webApiCategories.ts

export type WebApiCategory =
  | "all"
  | "display"
  | "time-locale"
  | "device-hardware"
  | "browser-environment"
  | "media-sensors"
  | "network"
  | "performance"
  | "theme-accessibility";

export interface WebApiCategoryMeta {
  id: WebApiCategory;
  label: string;
  description: string;
  icon: string;
}

export const WEB_API_CATEGORIES: WebApiCategoryMeta[] = [
  {
    id: "all",
    label: "All",
    description: "All available Web API cards",
    icon: "🌐",
  },
  {
    id: "display",
    label: "Display & Screen",
    description: "Physical display properties, resolution, and color support",
    icon: "🖥️",
  },
  {
    id: "time-locale",
    label: "Time & Locale",
    description: "Browser time, timezone, and regional settings",
    icon: "🕐",
  },
  {
    id: "device-hardware",
    label: "Device & Hardware",
    description: "Physical device capabilities and hardware information",
    icon: "💻",
  },
  {
    id: "browser-environment",
    label: "Browser & Environment",
    description: "The browser runtime, cookies, storage, and OS context",
    icon: "🌍",
  },
  {
    id: "media-sensors",
    label: "Media & Sensors",
    description: "Speech, camera, microphone, and device sensor APIs",
    icon: "🎙️",
  },
  {
    id: "network",
    label: "Network",
    description: "Connectivity, online status, and network information",
    icon: "📡",
  },
  {
    id: "performance",
    label: "Performance",
    description: "Page visibility, idle detection, and runtime performance",
    icon: "⚡",
  },
  {
    id: "theme-accessibility",
    label: "Theme & Accessibility",
    description: "System theme and user accessibility preferences",
    icon: "♿",
  },
];

// Maps each card's unique key to its category.
// This is the single place to register a card's category.
export const CARD_CATEGORY_MAP: Record<string, WebApiCategory> = {
  // ── Display & Screen ──────────────────────────────────────────────────
  screenColorDepth: "display",
  screenResolution: "display",
  screenOrientation: "display",
  windowSize: "display",
  colorGamut: "display",
  hdrSupport: "display",
  webGLInfo: "display",

  // ── Time & Locale ─────────────────────────────────────────────────────
  currentTime: "time-locale",
  currentDate: "time-locale",
  timeZone: "time-locale",
  navigatorLanguage: "time-locale", // FIX: was missing

  // ── Device & Hardware ─────────────────────────────────────────────────
  batteryStatus: "device-hardware",
  deviceMemory: "device-hardware",
  cpuConcurrency: "device-hardware",
  touchSupport: "device-hardware",

  // ── Browser & Environment ─────────────────────────────────────────────
  cookieStatus: "browser-environment",
  browserDetection: "browser-environment",
  osDetection: "browser-environment",
  storageQuota: "browser-environment",
  serviceWorkerSupport: "browser-environment",
  clipboardApi: "browser-environment",
  notificationPermission: "browser-environment",

  // ── Media & Sensors ───────────────────────────────────────────────────
  speechRecognition: "media-sensors",
  speechSynthesis: "media-sensors",
  geolocationSupport: "media-sensors",
  vibrationApi: "media-sensors",

  // ── Network ───────────────────────────────────────────────────────────
  onlineStatus: "network", // FIX: was missing
  networkInfo: "network", // FIX: was missing

  // ── Performance ───────────────────────────────────────────────────────
  pageVisibility: "performance",

  // ── Theme & Accessibility ─────────────────────────────────────────────
  themePreference: "theme-accessibility",
  prefersReducedMotion: "theme-accessibility",
  prefersContrast: "theme-accessibility",
  forcedColors: "theme-accessibility",
};
