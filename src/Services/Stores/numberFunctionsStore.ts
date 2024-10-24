import { create } from "zustand";

interface NumberFunctionStore {
  selectedNumberFunction: string;
  setSelectedNumberFunction: (fn: string) => void;
}

const useNumberFunctionsStore = create<NumberFunctionStore>((set) => ({
  selectedNumberFunction: "Number to HEX",
  setSelectedNumberFunction: (fn: string) =>
    set({ selectedNumberFunction: fn }),
}));

export default useNumberFunctionsStore;
