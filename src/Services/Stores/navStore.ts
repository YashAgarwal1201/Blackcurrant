// src/Services/Stores/navStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BaseTheme, AccentColor } from "../Data/ThemesConstants";

interface NavbarState {
  isSideMenuOpen: boolean;
  toggleSideMenu: () => void;
  closeSideMenu: () => void;

  headerTitle: string;
  setHeaderTitle: (title: string) => void;

  isFeedbackDialogOpen: boolean;
  openFeedbackDialog: () => void;
  closeFeedbackDialog: () => void;

  isChatDialogOpen: boolean;
  openChatDialog: () => void;
  closeChatDialog: () => void;

  baseTheme: BaseTheme;
  accentColor: AccentColor;
  setBaseTheme: (theme: BaseTheme) => void;
  setAccentColor: (accent: AccentColor) => void;
}

const useNavStore = create<NavbarState>()(
  persist(
    (set) => ({
      isSideMenuOpen: false,
      toggleSideMenu: () =>
        set((state) => ({ isSideMenuOpen: !state.isSideMenuOpen })),
      closeSideMenu: () => set({ isSideMenuOpen: false }),

      headerTitle: "",
      setHeaderTitle: (title) => set({ headerTitle: title }),

      isFeedbackDialogOpen: false,
      openFeedbackDialog: () => set({ isFeedbackDialogOpen: true }),
      closeFeedbackDialog: () => set({ isFeedbackDialogOpen: false }),

      isChatDialogOpen: false,
      openChatDialog: () => set({ isChatDialogOpen: true }),
      closeChatDialog: () => set({ isChatDialogOpen: false }),

      baseTheme: "system",
      accentColor: "currant",
      setBaseTheme: (theme) => set({ baseTheme: theme }),
      setAccentColor: (accent) => set({ accentColor: accent }),
    }),
    {
      name: "blackcurrant-theme-store",
      partialize: (state) => ({
        baseTheme: state.baseTheme,
        accentColor: state.accentColor,
      }),
    },
  ),
);

export default useNavStore;
