// src/Services/Stores/webApisStore.ts

import { create } from "zustand";
import type { WebApiCategory } from "../webApiCategories";

interface WebApisState {
  activeCategory: WebApiCategory;
  searchQuery: string;
  setActiveCategory: (category: WebApiCategory) => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
}

export const useWebApisStore = create<WebApisState>((set) => ({
  activeCategory: "all",
  searchQuery: "",
  setActiveCategory: (category) => set({ activeCategory: category }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  resetFilters: () => set({ activeCategory: "all", searchQuery: "" }),
}));
