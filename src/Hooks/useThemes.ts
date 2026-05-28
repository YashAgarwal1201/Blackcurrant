// src/hooks/useThemes.ts
import { useEffect } from "react";
import { BaseTheme, AccentColor } from "../Services/Data/ThemesConstants";

export const useTheme = (base: BaseTheme, accent: AccentColor) => {
  useEffect(() => {
    const html = document.documentElement;

    const resolved =
      base === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : base;

    html.setAttribute("data-theme", resolved);
    html.setAttribute("data-accent", accent);

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      requestAnimationFrame(() => {
        const color = getComputedStyle(html)
          .getPropertyValue("--base-100")
          .trim();
        if (color) metaThemeColor.setAttribute("content", color);
      });
    }

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = () => {
      if (base === "system") {
        const r = mq.matches ? "dark" : "light";
        html.setAttribute("data-theme", r);
      }
    };

    mq.addEventListener("change", onSystemChange);
    return () => mq.removeEventListener("change", onSystemChange);
  }, [base, accent]);
};
