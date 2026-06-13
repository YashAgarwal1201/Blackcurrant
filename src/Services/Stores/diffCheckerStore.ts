import { create } from "zustand";

export type DiffMode = "text" | "image";
export type TextDiffGranularity = "lines" | "words" | "chars";
export type TextDiffView = "inline" | "split";

interface DiffCheckerStore {
  activeMode: DiffMode;
  setActiveMode: (mode: DiffMode) => void;

  // text diff
  originalText: string;
  modifiedText: string;
  granularity: TextDiffGranularity;
  diffView: TextDiffView;
  setOriginalText: (text: string) => void;
  setModifiedText: (text: string) => void;
  setGranularity: (g: TextDiffGranularity) => void;
  setDiffView: (v: TextDiffView) => void;

  // image diff
  originalImage: string | null;
  modifiedImage: string | null;
  imageDiffThreshold: number;
  setOriginalImage: (src: string | null) => void;
  setModifiedImage: (src: string | null) => void;
  setImageDiffThreshold: (t: number) => void;
}

const useDiffCheckerStore = create<DiffCheckerStore>((set) => ({
  activeMode: "text",
  setActiveMode: (mode) => set({ activeMode: mode }),

  originalText: "",
  modifiedText: "",
  granularity: "lines",
  diffView: "inline",
  setOriginalText: (text) => set({ originalText: text }),
  setModifiedText: (text) => set({ modifiedText: text }),
  setGranularity: (g) => set({ granularity: g }),
  setDiffView: (v) => set({ diffView: v }),

  originalImage: null,
  modifiedImage: null,
  imageDiffThreshold: 0.1,
  setOriginalImage: (src) => set({ originalImage: src }),
  setModifiedImage: (src) => set({ modifiedImage: src }),
  setImageDiffThreshold: (t) => set({ imageDiffThreshold: t }),
}));

export default useDiffCheckerStore;
