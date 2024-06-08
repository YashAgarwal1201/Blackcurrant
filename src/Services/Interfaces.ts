import { Dispatch } from "react";

import { Toast } from "primereact/toast";

// import { AxiosResponse } from 'axios';

export type Action<T> = { type: string; payload?: T };

export interface State {
  [key: string]: any;
  toast: Toast | null;
  showAllApps: boolean;
  showSettings: boolean;
  wallpaper: {
    changeWallpaper: boolean;
    wallpaperUrl: string;
  };
  modalContent: ModalContent;
  menuOption: string;
  easyMode: boolean;
  pinnedApps: string[];
  openedApps: string[];
}

export interface ToastInterface {
  severity: "success" | "info" | "warn" | "error" | undefined;
  summary: "Success" | "Info" | "Warning" | "Error";
  detail: string;
  life?: number;
}

export type ActionType =
  | Toast
  | boolean
  | string
  | null
  | ToastInterface
  | { title: string; url: string; type: string }
  | { key: string; value: boolean };

export interface AppContextType {
  state: State;
  dispatch: Dispatch<Action<ActionType>>;
  showToast: (
    severity: "success" | "info" | "warn" | "error" | undefined,
    summary: "Success" | "Info" | "Warning" | "Error",
    detail: string,
    life?: number
  ) => void;
  setShowAllApps: (showAllApps: boolean) => void;
  setShowSettings: (showSettings: boolean) => void;
}

export interface ModalContent {
  header: any;
  body: any;
}

export type dispatchParamType = {
  type: string;
  contextStateKey: string;
  payload: any;
};

export type MenuOption = {
  [key: string]: string | undefined;
};
