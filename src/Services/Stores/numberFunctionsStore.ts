import { create } from "zustand";

interface NumberFunctionStore {
  selectedNumberFunction: string;
  setSelectedNumberFunction: (fn: string) => void;
}

const useNumberFunctionsStore = create<NumberFunctionStore>((set) => ({
  selectedNumberFunction: "",
  setSelectedNumberFunction: (fn: string) =>
    set({ selectedNumberFunction: fn }),
}));

export default useNumberFunctionsStore;
