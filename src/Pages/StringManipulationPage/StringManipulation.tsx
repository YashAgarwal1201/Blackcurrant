// src/Pages/StringManipulationPage/StringManipulation.tsx
import { useState, useEffect } from "react";
import Layout from "../../Layout/Layout";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { useForm } from "react-hook-form";
import { STRING_OPTIONS, stringFunctions } from "../../Services/Data/Constants";
import useStringFunctionsStore from "../../Services/Stores/stringFunctionsStore";
import useToastStore from "../../Services/Stores/toastMessageStore";
import GoBackBtn from "../../Layout/GoBackBtn";
import { X, ArrowRight } from "lucide-react";

interface StringFunctionMeta {
  description: string;
  example: string;
  exampleResult: string;
  inputNote: string;
}

const STRING_FUNCTION_META: Record<string, StringFunctionMeta> = {
  "Alternate Case": {
    description:
      "Alternates the case of each letter in the string — first letter uppercase, second lowercase, and so on. Non-letter characters are kept as-is and do not affect the toggle.",
    example: "hello world",
    exampleResult: "HeLlO WoRlD",
    inputNote: "Any string. Non-letter characters are ignored by the toggle.",
  },
  Reverse: {
    description:
      "Reverses the order of every character in the string, including spaces and punctuation.",
    example: "hello",
    exampleResult: "olleh",
    inputNote: "Any string.",
  },
  "Pascal Case": {
    description:
      "Converts the string to PascalCase (UpperCamelCase) — each word starts with a capital letter and all separators are removed.",
    example: "hello world",
    exampleResult: "HelloWorld",
    inputNote:
      "Words separated by spaces, hyphens, underscores, or other non-alphanumeric characters.",
  },
  "Camel Case": {
    description:
      "Converts the string to camelCase — first word all lowercase, subsequent words capitalised, all separators removed.",
    example: "hello world",
    exampleResult: "helloWorld",
    inputNote:
      "Words separated by spaces, hyphens, underscores, or other non-alphanumeric characters.",
  },
  "Kebab Case": {
    description:
      "Converts the string to kebab-case — all lowercase, words separated by hyphens. Commonly used in URLs and CSS class names.",
    example: "Hello World",
    exampleResult: "hello-world",
    inputNote: "Any string. Leading/trailing hyphens are trimmed from output.",
  },
  "Snake Case": {
    description:
      "Converts the string to snake_case — all lowercase, words separated by underscores. Common in Python variable names and database columns.",
    example: "Hello World",
    exampleResult: "hello_world",
    inputNote:
      "Any string. Leading/trailing underscores are trimmed from output.",
  },
  "Screaming Snake Case": {
    description:
      "Converts the string to SCREAMING_SNAKE_CASE — all uppercase, words separated by underscores. Typically used for constants.",
    example: "Hello World",
    exampleResult: "HELLO_WORLD",
    inputNote:
      "Any string. Leading/trailing underscores are trimmed from output.",
  },
  "Randomise Case": {
    description:
      "Randomly uppercases or lowercases each character in the string. Running it twice on the same input will likely produce different results.",
    example: "hello",
    exampleResult: "hElLo",
    inputNote:
      "Any string. The result is non-deterministic — output will vary between runs.",
  },
  "No Whitespace": {
    description:
      "Removes every whitespace character (spaces, tabs, newlines) from the string. Useful for normalising identifiers or compact data.",
    example: "a b  c",
    exampleResult: "abc",
    inputNote:
      "Any string. All internal and surrounding whitespace is removed.",
  },
  "Binary String": {
    description:
      "Converts each character to its binary representation using the character's Unicode code point. Standard ASCII characters produce 8-bit values; extended characters produce wider values (padded to the nearest byte boundary).",
    example: "A",
    exampleResult: "01000001",
    inputNote:
      "Any string. Output groups are space-separated, one per character.",
  },
  "ASCII String": {
    description:
      "Returns the decimal code value for each character in the string. Pure ASCII characters (0–127) produce standard ASCII codes. Characters outside that range are marked with (?) to indicate they are not standard ASCII values.",
    example: "A",
    exampleResult: "65",
    inputNote:
      "Any string. Non-ASCII characters (code > 127) are shown with a (?) suffix. Output values are comma-separated.",
  },
};

// ── Component ────────────────────────────────────────────────────────────────

const StringManipulation = () => {
  const { register, handleSubmit, reset, watch, setValue } = useForm();
  const showToast = useToastStore((state) => state.showToast);
  const { selectedStringFunction, setSelectedStringFunction } =
    useStringFunctionsStore();

  const [outputString, setOutputString] = useState("");
  const [showFunctionInfo, setShowFunctionInfo] = useState(false);

  const [mobileTab, setMobileTab] = useState<"input" | "output">("input");

  const inputText = watch("inputText");

  useEffect(() => {
    if (inputText && selectedStringFunction) {
      processString(inputText);
    }
  }, [selectedStringFunction, inputText]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        if (inputText) processString(inputText);
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [inputText, selectedStringFunction]);

  const processString = (inputString: string) => {
    const selectedFunction = stringFunctions[selectedStringFunction];
    if (selectedFunction && inputString) {
      setOutputString(selectedFunction(inputString));
    }
  };

  const onSubmit = (data: any) => processString(data.inputText);

  const handleCopy = () => {
    navigator.clipboard.writeText(outputString);
    showToast("success", "Copied", "Output copied to clipboard");
  };

  const handleUseAsInput = () => {
    setValue("inputText", outputString);
    setMobileTab("input");
    showToast("info", "Input Updated", "Output transferred to input");
  };

  const handleClear = () => {
    reset();
    setOutputString("");
    setMobileTab("input");
    showToast("info", "Cleared", "All fields have been cleared");
  };

  const getCharacterDifference = () => {
    if (!inputText || !outputString) return null;
    return outputString.length - inputText.length;
  };

  const getFunctionCode = (): string => {
    if (!selectedStringFunction) return "";
    const fn = stringFunctions[selectedStringFunction];
    return fn ? fn.toString() : "";
  };

  const meta = STRING_FUNCTION_META[selectedStringFunction];
  const charDiff = getCharacterDifference();
  const hasContent = !!(inputText || outputString);

  return (
    <Layout>
      {/* ── Function Info Dialog ── */}
      <Dialog
        header={
          <h2 className="font-heading text-xl sm:text-2xl text-base-content">
            {selectedStringFunction}
          </h2>
        }
        visible={showFunctionInfo}
        onHide={() => setShowFunctionInfo(false)}
        dismissableMask
        draggable={false}
        resizable={false}
        className="absolute! bottom-0! sm:bottom-auto! w-full max-w-md bg-base-200 rounded-3xl!"
        headerClassName="bg-transparent! font-heading"
        contentClassName="bg-transparent! font-content"
        closeIcon={<X size={20} className="text-base-content" />}
      >
        {meta && (
          <div className="flex flex-col gap-y-4 text-base-content bg-base-300 rounded-2xl p-4">
            {/* Description */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-neutral-content mb-1 font-content">
                Description
              </p>
              <p className="text-base text-base-content font-content leading-relaxed">
                {meta.description}
              </p>
            </div>

            {/* Example — styled input → result row, matching the numbers page */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-neutral-content mb-1 font-content">
                Example
              </p>
              <div className="flex items-center gap-2 bg-base-200 border border-neutral rounded-lg px-3 py-2.5">
                <span className="font-mono text-sm text-base-content">
                  {meta.example}
                </span>
                <ArrowRight
                  size={14}
                  className="text-neutral-content shrink-0"
                />
                <span className="font-mono text-sm text-primary font-semibold">
                  {meta.exampleResult}
                </span>
              </div>
            </div>

            {/* Input type / constraints */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-neutral-content mb-1 font-content">
                Input
              </p>
              <p className="text-sm text-neutral-content font-content">
                {meta.inputNote}
              </p>
            </div>

            {/* Function source code */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-neutral-content mb-1 font-content">
                Function Code
              </p>
              <pre className="p-3 bg-base-100 border border-neutral rounded-lg overflow-x-auto text-xs text-base-content font-mono leading-relaxed">
                {getFunctionCode()}
              </pre>
            </div>
          </div>
        )}
      </Dialog>

      <div className="w-full h-full flex flex-col">
        {/* ── Header ── */}
        <div className="shrink-0 px-3 pt-3 pb-2 md:px-4 md:pt-4 flex items-center gap-x-1">
          <GoBackBtn />
          <h1 className="text-2xl xs:text-3xl mdl:text-4xl text-primary font-heading select-none truncate">
            Play with Strings
          </h1>
        </div>

        {/* ── Function picker ── */}
        <div className="shrink-0 px-3 md:px-4 pb-2 md:pb-3">
          <p className="text-base xs:text-lg text-base-content font-subHeading mb-2">
            Choose a function
          </p>
          <div className="flex items-center gap-2">
            <Dropdown
              value={selectedStringFunction}
              onChange={(e) => setSelectedStringFunction(e.value)}
              options={STRING_OPTIONS}
              placeholder="Select a string function"
              filter
              className="flex-1 h-10 bg-base-200! border! border-neutral! rounded-lg! text-base-content"
              panelClassName="bg-base-200 border border-neutral rounded-lg shadow-lg"
            />
            <Button
              type="button"
              icon="pi pi-info-circle"
              disabled={!selectedStringFunction}
              className="shrink-0 h-10 w-10 text-neutral-content bg-base-200 border border-neutral rounded-lg
                         disabled:opacity-40 disabled:cursor-not-allowed
                         active:scale-95 transition-transform duration-100"
              onClick={() => setShowFunctionInfo(true)}
            />
          </div>
        </div>

        <div className="md:hidden shrink-0 px-3 pb-2">
          <div className="flex items-center gap-1 bg-base-200 rounded-xl p-1">
            <button
              type="button"
              onClick={() => setMobileTab("input")}
              className={`flex-1 flex items-center justify-center gap-1.5 h-9 rounded-lg text-sm font-semibold font-subHeading transition-colors duration-150
                ${
                  mobileTab === "input"
                    ? "bg-base-100 text-base-content shadow-sm"
                    : "text-neutral-content"
                }`}
            >
              <span className="w-4 h-4 rounded-full bg-primary text-primary-content text-[9px] font-bold flex items-center justify-center shrink-0">
                1
              </span>
              Input
              {inputText && (
                <span className="text-[10px] text-neutral-content tabular-nums font-content font-normal">
                  {inputText.length}
                </span>
              )}
            </button>

            {/* Arrow between tabs — echoes the desktop connector */}
            <ArrowRight
              size={14}
              className="shrink-0 text-neutral-content opacity-50"
            />

            <button
              type="button"
              onClick={() => setMobileTab("output")}
              className={`flex-1 flex items-center justify-center gap-1.5 h-9 rounded-lg text-sm font-semibold font-subHeading transition-colors duration-150
                ${
                  mobileTab === "output"
                    ? "bg-base-100 text-base-content shadow-sm"
                    : "text-neutral-content"
                }`}
            >
              <span className="w-4 h-4 rounded-full bg-neutral text-base-content text-[9px] font-bold flex items-center justify-center shrink-0">
                2
              </span>
              Output
              {outputString && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              )}
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-0 flex flex-col md:flex-row md:items-stretch px-3 md:px-4 pb-3 md:pb-4 gap-0">
          {/* ── Input panel ── */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={`flex-col min-h-0 md:flex md:flex-1
              ${mobileTab === "input" ? "flex flex-1" : "hidden"}`}
          >
            {/* Panel header — desktop shows step badge, mobile tab bar handles it */}
            <div className="hidden md:flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-content text-xs font-bold flex items-center justify-center shrink-0 font-content">
                  1
                </span>
                <span className="text-base font-semibold text-base-content font-subHeading">
                  Input
                </span>
              </div>
              <span className="text-xs text-neutral-content tabular-nums font-content">
                {inputText?.length || 0}
                <span className="opacity-50">/3500</span>
              </span>
            </div>

            {/* Mobile panel header — minimal, tab bar already shows step */}
            <div className="md:hidden flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-base-content font-subHeading">
                Type or paste text
              </span>
              <span className="text-xs text-neutral-content tabular-nums font-content">
                {inputText?.length || 0}
                <span className="opacity-50">/3500</span>
              </span>
            </div>

            <InputTextarea
              disabled={!selectedStringFunction}
              className="w-full flex-1 min-h-0 p-4 font-content text-base-content
                         bg-base-200 border-2 border-neutral rounded-2xl
                         focus:border-primary!
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-colors duration-150 resize-none"
              placeholder={
                selectedStringFunction
                  ? "Type or paste text here…"
                  : "Select a function first…"
              }
              {...register("inputText")}
            />

            {outputString && (
              <button
                type="button"
                onClick={() => setMobileTab("output")}
                className="md:hidden mt-2 w-full h-10 flex items-center justify-center gap-2
                           bg-base-300 border border-neutral rounded-xl
                           text-sm text-neutral-content font-subHeading
                           active:scale-95 transition-transform duration-100"
              >
                <span className="text-primary font-semibold">See result</span>
                <ArrowRight size={14} className="text-primary" />
              </button>
            )}
          </form>

          {/* ── Desktop pipeline connector (hidden on mobile) ── */}
          <div className="hidden md:flex flex-col items-center justify-center gap-2 px-3 shrink-0">
            <div className="flex-1 w-px bg-neutral" />
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-7 h-7 rounded-full bg-base-300 border border-neutral flex items-center justify-center shrink-0">
                <ArrowRight size={14} className="text-neutral-content" />
              </div>
              {selectedStringFunction && (
                <span
                  className="max-w-[64px] text-center text-[10px] leading-tight font-semibold text-primary font-content
                                 bg-base-300 border border-neutral rounded-lg px-1.5 py-1 wrap-break-word"
                >
                  {selectedStringFunction}
                </span>
              )}
            </div>
            <div className="flex-1 w-px bg-neutral" />
          </div>

          {/* ── Output panel ── */}
          <div
            className={`flex-col min-h-0 md:flex md:flex-1
              ${mobileTab === "output" ? "flex flex-1" : "hidden"}`}
          >
            {/* Desktop header */}
            <div className="hidden md:flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-neutral text-base-content text-xs font-bold flex items-center justify-center shrink-0 font-content">
                  2
                </span>
                <span className="text-base font-semibold text-base-content font-subHeading">
                  Output
                </span>
              </div>
              <span className="text-xs text-neutral-content tabular-nums font-content flex items-center gap-1">
                {outputString?.length || 0}
                <span className="opacity-50">/3500</span>
                {charDiff !== null && (
                  <span
                    className={
                      charDiff >= 0
                        ? "text-emerald-400 font-medium"
                        : "text-rose-400 font-medium"
                    }
                  >
                    ({charDiff >= 0 ? "+" : ""}
                    {charDiff})
                  </span>
                )}
              </span>
            </div>

            {/* Mobile header */}
            <div className="md:hidden flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-base-content font-subHeading">
                Result
              </span>
              <span className="text-xs text-neutral-content tabular-nums font-content flex items-center gap-1">
                {outputString?.length || 0}
                <span className="opacity-50">/3500</span>
                {charDiff !== null && (
                  <span
                    className={
                      charDiff >= 0
                        ? "text-emerald-400 font-medium"
                        : "text-rose-400 font-medium"
                    }
                  >
                    ({charDiff >= 0 ? "+" : ""}
                    {charDiff})
                  </span>
                )}
              </span>
            </div>

            <InputTextarea
              readOnly
              value={outputString}
              className="w-full flex-1 min-h-0 p-4 font-content text-base-content
                         bg-base-300
                         border-2 border-neutral border-l-[3px] border-l-primary
                         rounded-2xl italic
                         resize-none cursor-default"
              placeholder="Output will appear here…"
            />

            {/* Action bar */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Button
                type="button"
                disabled={!outputString}
                label="Use as Input"
                icon="pi pi-arrow-up"
                className="h-9 px-4 text-sm text-primary-content bg-primary rounded-full border-transparent font-semibold
                           disabled:opacity-40 disabled:cursor-not-allowed
                           active:scale-95 transition-transform duration-100"
                onClick={handleUseAsInput}
              />
              <Button
                type="button"
                disabled={!outputString}
                label="Copy"
                icon="pi pi-copy"
                className="h-9 px-3 text-sm text-base-content bg-transparent border border-neutral rounded-full
                           disabled:opacity-40 disabled:cursor-not-allowed
                           active:scale-95 transition-transform duration-100"
                onClick={handleCopy}
              />
              <div className="flex-1" />
              <Button
                type="button"
                disabled={!inputText || !selectedStringFunction}
                icon="pi pi-bolt"
                aria-label="Re-run"
                title="Re-run function"
                className="h-9 w-9 text-neutral-content bg-transparent border border-neutral rounded-full
                           disabled:opacity-40 disabled:cursor-not-allowed
                           active:scale-95 transition-transform duration-100"
                onClick={() => processString(inputText)}
              />
              <Button
                type="button"
                disabled={!hasContent}
                icon="pi pi-trash"
                aria-label="Clear all"
                title="Clear all"
                className="h-9 w-9 text-rose-400 bg-transparent border border-neutral rounded-full
                           disabled:opacity-40 disabled:cursor-not-allowed
                           active:scale-95 transition-transform duration-100"
                onClick={handleClear}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StringManipulation;
