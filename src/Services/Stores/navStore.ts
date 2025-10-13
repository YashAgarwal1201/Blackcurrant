// navStore.ts
import { create } from "zustand";

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
}

// Create the Zustand store with explicit types
const useNavStore = create<NavbarState>((set) => ({
  // State for the side menu (open/close)
  isSideMenuOpen: false,
  toggleSideMenu: () =>
    set((state) => ({
      isSideMenuOpen: !state.isSideMenuOpen,
    })),
  closeSideMenu: () => set({ isSideMenuOpen: false }),

  // State for the header title
  headerTitle: "",
  setHeaderTitle: (title) => set({ headerTitle: title }),

  // State for the feedback dialog (open/close)
  isFeedbackDialogOpen: false,
  openFeedbackDialog: () => set({ isFeedbackDialogOpen: true }),
  closeFeedbackDialog: () => set({ isFeedbackDialogOpen: false }),

  // State for the chat dialog (open/close)
  isChatDialogOpen: false,
  openChatDialog: () => set({ isChatDialogOpen: true }),
  closeChatDialog: () => set({ isChatDialogOpen: false }),
}));

export default useNavStore;
