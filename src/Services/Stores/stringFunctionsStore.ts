import { create } from "zustand";

interface StringFunctionStore {
  selectedStringFunction: string;
  setSelectedStringFunction: (fn: string) => void;
}

const useStringFunctionsStore = create<StringFunctionStore>((set) => ({
  selectedStringFunction: "Alternate Case",
  setSelectedStringFunction: (fn: string) =>
    set({ selectedStringFunction: fn }),
}));

export default useStringFunctionsStore;
