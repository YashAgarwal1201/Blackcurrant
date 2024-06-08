import React, { createContext, useReducer } from "react";

import { Toast } from "primereact/toast/toast";

import {
  Action,
  ActionType,
  AppContextType,
  // ModalContent,
  State,
} from "./Interfaces";

const initialState: State = sessionStorage.getItem(`bananaAppData`)
  ? JSON.parse(sessionStorage.getItem(`bananaAppData`) as string)
  : {
      toast: null,
      showAllApps: false,
      showSettings: false,
      wallpaper: {
        changeWallpaper: false,
        wallpaperUrl: "",
      },
      modalContent: {
        header: "",
        body: "",
      },
      menuOption: "",
      easyMode: false,
      pinnedApps: [],
      openedApps: [],
    };

const reducer = (state: State, action: Action<ActionType> | any): State => {
  // const { contextStateKey, payload } = (action?.payload as 'contextStateKey' | 'payload') ?? {};

  switch (action.type) {
    case "SET_TOAST_REF": {
      return { ...state, toast: action.payload as Toast };
    }

    case "SET_MODAL_CONTENT": {
      return {
        ...state,
        modalContent: action.payload as any,
      };
    }

    case "SET_MENU_OPTION": {
      return {
        ...state,
        menuOption: action.payload as string,
      };
    }

    case "SET_SHOW_ALL_APPS": {
      return {
        ...state,
        showAllApps: action.payload as boolean,
      };
    }

    case "SET_SHOW_SETTINGS": {
      return {
        ...state,
        showSettings: action.payload as boolean,
      };
    }

    case "SET_OPENED_APPS": {
      const updatedOpenedApps = Array.isArray(state.openedApps)
        ? state.openedApps.includes(action.payload)
          ? state.openedApps
          : [...state.openedApps, action.payload]
        : [action.payload];
      return {
        ...state,
        openedApps: updatedOpenedApps,
      };
    }

    case "REMOVE_OPENED_APP":
      return {
        ...state,
        openedApps: state.openedApps.filter((app) => app !== action.payload),
      };

    default:
      return state;
  }
};

const AppContext = createContext<AppContextType>({
  state: initialState,
  dispatch: () => null,
  showToast: () => null,
  setShowAllApps: () => null,
  setShowSettings: () => null,
});

const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const showToast = (
    severity: "success" | "info" | "warn" | "error" | undefined,
    summary: "Success" | "Info" | "Warning" | "Error",
    detail: string,
    life?: number
  ) => {
    // state.toast?.clear();
    state.toast?.show({ severity, summary, detail, life });
  };

  const setShowAllApps = (showAllApps: boolean) => {
    dispatch({ type: "SET_SHOW_ALL_APPS", payload: showAllApps });
  };

  const setShowSettings = (showSettings: boolean) => {
    dispatch({ type: "SET_SHOW_SETTINGS", payload: showSettings });
  };

  const contextValue: AppContextType = {
    state,
    dispatch,
    showToast,
    setShowAllApps,
    setShowSettings,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

const useAppContext = () => {
  const context = React.useContext<AppContextType>(AppContext);

  if (context === undefined) {
    throw new Error("useAppContext must be used within a AppContextProvider");
  }

  return context;
};

export { AppContext, AppContextProvider, useAppContext };
