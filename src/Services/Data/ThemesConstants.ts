// src/Data/ThemesConstants.ts

export const BASE_THEMES = [
  { label: "System", value: "system" },
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
];

export const ACCENT_COLORS = [
  {
    label: "Graphite",
    value: "graphite",
    swatch: "#a8a1ad",
  },

  {
    label: "Currant",
    value: "currant",
    swatch: "#b46cff",
  },

  {
    label: "Plum",
    value: "plum",
    swatch: "#8b5cf6",
  },

  {
    label: "Berry",
    value: "berry",
    swatch: "#d86b8a",
  },

  {
    label: "Wine",
    value: "wine",
    swatch: "#b24b6a",
  },

  {
    label: "Leaf",
    value: "leaf",
    swatch: "#6f8f3a",
  },
] as const;

export type BaseTheme = (typeof BASE_THEMES)[number]["value"];
// "system" | "light" | "dark"

export type AccentColor = (typeof ACCENT_COLORS)[number]["value"];
// "graphite"
// | "currant"
// | "plum"
// | "berry"
// | "wine"
// | "leaf"
