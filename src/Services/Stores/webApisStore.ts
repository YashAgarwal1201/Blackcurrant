// src/Services/Stores/webApisStore.ts

import { create } from "zustand";
import type { WebApiCategory } from "../webApiCategories";

const PARAM_CATEGORY = "category";
const PARAM_QUERY = "q";

/** Read current URL params — safe to call outside React. */
const readParams = () => {
  const p = new URLSearchParams(window.location.search);
  return {
    activeCategory: (p.get(PARAM_CATEGORY) as WebApiCategory) ?? "all",
    searchQuery: p.get(PARAM_QUERY) ?? "",
  };
};

/** Push a new URL without triggering a navigation / full re-render. */
const pushParams = (category: WebApiCategory, query: string) => {
  const p = new URLSearchParams();
  if (category && category !== "all") p.set(PARAM_CATEGORY, category);
  if (query.trim()) p.set(PARAM_QUERY, query.trim());
  const search = p.toString() ? `?${p.toString()}` : window.location.pathname;
  window.history.replaceState(null, "", search);
};

interface WebApisStore {
  activeCategory: WebApiCategory;
  searchQuery: string;
  setActiveCategory: (cat: WebApiCategory) => void;
  setSearchQuery: (q: string) => void;
  resetFilters: () => void;
}

export const useWebApisStore = create<WebApisStore>((set) => ({
  // Initialise from URL so bookmarks/shared links restore state
  ...readParams(),

  setActiveCategory: (activeCategory) =>
    set((s) => {
      pushParams(activeCategory, s.searchQuery);
      return { activeCategory };
    }),

  setSearchQuery: (searchQuery) =>
    set((s) => {
      pushParams(s.activeCategory, searchQuery);
      return { searchQuery };
    }),

  resetFilters: () => {
    pushParams("all", "");
    return set({ activeCategory: "all", searchQuery: "" });
  },
}));
