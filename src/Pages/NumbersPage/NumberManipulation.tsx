// src/Pages/NumberManipulationPage/NumberManipulation.tsx
import { useState, useEffect, useCallback } from "react";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { useForm } from "react-hook-form";
import Layout from "../../Layout/Layout";
import { NUMBER_OPTIONS, numberFunctions } from "../../Services/Data/Constants";
import useNumberFunctionsStore from "../../Services/Stores/numberFunctionsStore";
import useToastStore from "../../Services/Stores/toastMessageStore";
import GoBackBtn from "../../Layout/GoBackBtn";
import { X, ArrowRight } from "lucide-react";

/*
 * ── Input type classification ─────────────────────────────────────────────────
 *
 * ROOT CAUSE of the "click outside to calculate" bug:
 * InputNumber commits its value on blur, not on change — so the useEffect
 * that watches the value never fires while the field is focused.
 *
 * FIX: use InputText (controlled) for string-input functions (HEX to Number,
 * Binary to Number). For numeric functions, switch from InputNumber + watch()
 * to a controlled local state updated via onChange — this fires on every
 * keystroke, not just on blur.
 *
 * "text" input functions: user types a string (hex or binary), result is a number.
 * "number" input functions: user types a number, result varies.
 * "double" input functions: two numeric inputs (GCD, LCM).
 */
type InputKind = "number" | "text" | "double";

const FUNCTION_META: Record<
  string,
  {
    kind: InputKind;
    label1: string;
    label2?: string;
    placeholder1: string;
    placeholder2?: string;
    description: string;
    example: string;
    exampleResult: string;
    integerOnly?: boolean;
    minVal?: number;
  }
> = {
  "Number to HEX": {
    kind: "number",
    label1: "Integer",
    placeholder1: "e.g. 255",
    description:
      "Converts a decimal integer to its hexadecimal (base-16) representation. Useful for colours, memory addresses, and low-level data.",
    example: "255",
    exampleResult: "FF",
    integerOnly: true,
    minVal: 0,
  },
  "HEX to Number": {
    kind: "text",
    label1: "Hex string",
    placeholder1: "e.g. FF or 1A3C",
    description:
      "Converts a hexadecimal string (base-16) back to a regular decimal number. Letters A–F are case-insensitive.",
    example: "FF",
    exampleResult: "255",
  },
  "Number to Binary": {
    kind: "number",
    label1: "Integer",
    placeholder1: "e.g. 10",
    description:
      "Converts a decimal integer to its binary (base-2) representation — the language of computers.",
    example: "10",
    exampleResult: "1010",
    integerOnly: true,
    minVal: 0,
  },
  "Binary to Number": {
    kind: "text",
    label1: "Binary string",
    placeholder1: "e.g. 1010",
    description:
      "Converts a binary string (base-2, only 0s and 1s) back to a regular decimal number.",
    example: "1010",
    exampleResult: "10",
  },
  "Is Prime": {
    kind: "number",
    label1: "Integer",
    placeholder1: "e.g. 17",
    description:
      "Checks whether a number is prime — divisible only by 1 and itself. Returns true or false.",
    example: "17",
    exampleResult: "true",
    integerOnly: true,
    minVal: 0,
  },
  Factorial: {
    kind: "number",
    label1: "Non-negative integer (n)",
    placeholder1: "e.g. 5",
    description:
      "Calculates n! — the product of all positive integers from 1 to n. By definition, 0! = 1. Negative numbers are not supported.",
    example: "5",
    exampleResult: "120",
    integerOnly: true,
    minVal: 0,
  },
  Fibonacci: {
    kind: "number",
    label1: "Length (n)",
    placeholder1: "e.g. 8",
    description:
      "Returns the first n numbers of the Fibonacci sequence, where each number is the sum of the two before it. Starts with 0, 1.",
    example: "8",
    exampleResult: "0, 1, 1, 2, 3, 5, 8, 13",
    integerOnly: true,
    minVal: 1,
  },
  "Sum of Digits": {
    kind: "number",
    label1: "Integer",
    placeholder1: "e.g. 1234",
    description:
      "Adds together all individual digits of the number. Useful in digital root calculations and number theory.",
    example: "1234",
    exampleResult: "10",
    integerOnly: true,
    minVal: 0,
  },
  "Reverse of Number": {
    kind: "number",
    label1: "Integer",
    placeholder1: "e.g. 1234",
    description:
      "Reverses the digits of a number. Trailing zeros become leading zeros and are dropped.",
    example: "1234",
    exampleResult: "4321",
    integerOnly: true,
    minVal: 0,
  },
  "Greatest Common Divisor": {
    kind: "double",
    label1: "First integer",
    label2: "Second integer",
    placeholder1: "e.g. 48",
    placeholder2: "e.g. 18",
    description:
      "Finds the largest integer that divides both numbers without a remainder. Uses the Euclidean algorithm.",
    example: "48, 18",
    exampleResult: "6",
    integerOnly: true,
    minVal: 1,
  },
  "Least Common Multiple": {
    kind: "double",
    label1: "First integer",
    label2: "Second integer",
    placeholder1: "e.g. 4",
    placeholder2: "e.g. 6",
    description:
      "Finds the smallest positive integer that is exactly divisible by both numbers. Useful for scheduling and fraction arithmetic.",
    example: "4, 6",
    exampleResult: "12",
    integerOnly: true,
    minVal: 1,
  },
};

const NumberManipulation = () => {
  const { reset } = useForm({
    defaultValues: { inputVal1: 0, inputVal2: 0 },
    mode: "onChange",
  });

  const showToast = useToastStore((state) => state.showToast);
  const { selectedNumberFunction, setSelectedNumberFunction } =
    useNumberFunctionsStore();

  /*
   * Controlled local state instead of react-hook-form watch().
   * This fires on every keystroke (onChange), solving the "click outside" bug.
   * inputText is used for HEX-to-Number and Binary-to-Number (string inputs).
   */
  const [inputVal1, setInputVal1] = useState<number>(0);
  const [inputVal2, setInputVal2] = useState<number>(0);
  const [inputText, setInputText] = useState<string>("");
  const [outputVal, setOutputVal] = useState<string>("");

  const getFunctionCode = (): string => {
    if (!selectedNumberFunction) return "";
    const fn = numberFunctions[selectedNumberFunction];
    return fn ? fn.toString() : "";
  };
  const [outputIsArray, setOutputIsArray] = useState(false);
  const [showFunctionInfo, setShowFunctionInfo] = useState(false);
  const [mobileTab, setMobileTab] = useState<"input" | "output">("input");
  const [validationError, setValidationError] = useState<string>("");

  const meta = FUNCTION_META[selectedNumberFunction];
  const isDouble = meta?.kind === "double";
  const isTextInput = meta?.kind === "text";

  const hasOutput = outputVal !== "";
  const hasContent =
    hasOutput || inputVal1 !== 0 || inputVal2 !== 0 || inputText !== "";

  /*
   * Validate input before processing.
   * Returns an error string or empty string if valid.
   */
  const validate = useCallback(
    (fn: string, v1: number | string, v2?: number): string => {
      const m = FUNCTION_META[fn];
      if (!m) return "";

      if (m.kind === "text") {
        const s = (v1 as string).trim();
        if (!s) return "";
        if (fn === "HEX to Number" && !/^[0-9a-fA-F]+$/.test(s))
          return "Only hex characters allowed (0–9, A–F)";
        if (fn === "Binary to Number" && !/^[01]+$/.test(s))
          return "Only binary digits allowed (0 and 1)";
        return "";
      }

      const n = v1 as number;
      if (fn === "Factorial" && n < 0)
        return "Factorial is not defined for negative numbers";
      if (fn === "Fibonacci" && n < 1) return "Enter a length of at least 1";
      if (
        (fn === "Greatest Common Divisor" || fn === "Least Common Multiple") &&
        (n < 1 || (v2 ?? 0) < 1)
      )
        return "Both values must be positive integers";
      if (fn === "Sum of Digits" && n < 0)
        return "Enter a non-negative integer";
      return "";
    },
    [],
  );

  const processNumber = useCallback(
    (fn: string, v1: number | string, v2?: number) => {
      const error = validate(fn, v1, v2);
      if (error) {
        setValidationError(error);
        setOutputVal("");
        return;
      }
      setValidationError("");

      const selectedFunction = numberFunctions[fn];
      if (!selectedFunction) return;

      try {
        const result = isDouble
          ? selectedFunction(v1 as number, v2 ?? 0)
          : selectedFunction(v1);

        if (Array.isArray(result)) {
          setOutputVal(result.join(", "));
          setOutputIsArray(true);
        } else {
          setOutputVal(result?.toString() ?? "");
          setOutputIsArray(false);
        }
      } catch {
        setOutputVal("Error");
      }
    },
    [isDouble, validate],
  );

  /*
   * Auto-process on every input change — no blur needed.
   * Text inputs debounce naturally since the user has to type the full string.
   */
  useEffect(() => {
    if (!selectedNumberFunction) return;

    if (isTextInput) {
      if (inputText.trim()) processNumber(selectedNumberFunction, inputText);
      else {
        setOutputVal("");
        setValidationError("");
      }
    } else if (isDouble) {
      processNumber(selectedNumberFunction, inputVal1, inputVal2);
    } else {
      processNumber(selectedNumberFunction, inputVal1);
    }
  }, [selectedNumberFunction, inputVal1, inputVal2, inputText]);

  // Reset local state when function changes
  useEffect(() => {
    setInputVal1(0);
    setInputVal2(0);
    setInputText("");
    setOutputVal("");
    setValidationError("");
    setOutputIsArray(false);
  }, [selectedNumberFunction]);

  const handleCopy = () => {
    navigator.clipboard.writeText(outputVal);
    showToast("success", "Copied", "Output copied to clipboard");
  };

  const handleUseAsInput = () => {
    if (outputIsArray) {
      showToast(
        "info",
        "Not applicable",
        "Sequence outputs can't be looped as input",
      );
      return;
    }
    if (isTextInput) {
      setInputText(outputVal);
    } else {
      setInputVal1(Number(outputVal) || 0);
      setInputVal2(0);
    }
    setMobileTab("input");
    showToast("info", "Input Updated", "Output transferred to input");
  };

  const handleClear = () => {
    setInputVal1(0);
    setInputVal2(0);
    setInputText("");
    setOutputVal("");
    setValidationError("");
    setMobileTab("input");
    showToast("info", "Cleared", "All fields have been cleared");
  };

  return (
    <Layout>
      {/* ── Function Info Dialog ── */}
      <Dialog
        header={
          <h2 className="font-heading text-xl sm:text-2xl text-base-content">
            {selectedNumberFunction}
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

            {/* Example */}
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

            {/* Input constraints */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-neutral-content mb-1 font-content">
                Input
              </p>
              <p className="text-sm text-neutral-content font-content">
                {meta.kind === "text"
                  ? `Text string (${selectedNumberFunction === "HEX to Number" ? "hex characters: 0–9, A–F" : "binary digits: 0 and 1"})`
                  : meta.kind === "double"
                    ? `Two ${meta.integerOnly ? "positive integers" : "numbers"}${meta.minVal !== undefined ? ` ≥ ${meta.minVal}` : ""}`
                    : `${meta.integerOnly ? "Integer" : "Number"}${meta.minVal !== undefined ? ` ≥ ${meta.minVal}` : ""}`}
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
            Play with Numbers
          </h1>
        </div>

        {/* ── Function picker ── */}
        <div className="shrink-0 px-3 md:px-4 pb-2 md:pb-3">
          <p className="text-base xs:text-lg text-base-content font-subHeading mb-2">
            Choose a function
          </p>
          <div className="flex items-center gap-2">
            <Dropdown
              value={selectedNumberFunction}
              onChange={(e) => setSelectedNumberFunction(e.value)}
              options={NUMBER_OPTIONS}
              placeholder="Select a number function"
              filter
              filterPlaceholder="Search functions..."
              className="flex-1 h-10 bg-base-200! border! border-neutral! rounded-lg! text-base-content"
              panelClassName="bg-base-200 border border-neutral rounded-lg shadow-lg"
            />
            <Button
              type="button"
              icon="pi pi-info-circle"
              disabled={!selectedNumberFunction}
              className="shrink-0 h-10 w-10 text-neutral-content bg-base-200 border border-neutral rounded-lg
                         disabled:opacity-40 disabled:cursor-not-allowed
                         active:scale-95 transition-transform duration-100"
              onClick={() => setShowFunctionInfo(true)}
            />
          </div>
        </div>

        {/* ── Mobile tab switcher ── */}
        <div className="md:hidden shrink-0 px-3 pb-2">
          <div className="flex items-center gap-1 bg-base-200 rounded-xl p-1">
            <button
              type="button"
              onClick={() => setMobileTab("input")}
              className={`flex-1 flex items-center justify-center gap-1.5 h-9 rounded-lg text-sm font-semibold font-subHeading transition-colors duration-150
                ${mobileTab === "input" ? "bg-base-100 text-base-content shadow-sm" : "text-neutral-content"}`}
            >
              <span className="w-4 h-4 rounded-full bg-primary text-primary-content text-[9px] font-bold flex items-center justify-center shrink-0">
                1
              </span>
              Input
            </button>
            <ArrowRight
              size={14}
              className="shrink-0 text-neutral-content opacity-50"
            />
            <button
              type="button"
              onClick={() => setMobileTab("output")}
              className={`flex-1 flex items-center justify-center gap-1.5 h-9 rounded-lg text-sm font-semibold font-subHeading transition-colors duration-150
                ${mobileTab === "output" ? "bg-base-100 text-base-content shadow-sm" : "text-neutral-content"}`}
            >
              <span className="w-4 h-4 rounded-full bg-neutral text-base-content text-[9px] font-bold flex items-center justify-center shrink-0">
                2
              </span>
              Output
              {hasOutput && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              )}
            </button>
          </div>
        </div>

        {/* ── Panels ── */}
        <div className="flex-1 min-h-0 flex flex-col md:flex-row md:items-start px-3 md:px-4 pb-3 md:pb-4 gap-0">
          {/* ── Input panel ── */}
          <div
            className={`flex-col min-h-0 md:flex md:flex-1 ${mobileTab === "input" ? "flex flex-1" : "hidden"}`}
          >
            {/* Desktop header */}
            <div className="hidden md:flex items-center mb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-content text-xs font-bold flex items-center justify-center shrink-0 font-content">
                  1
                </span>
                <span className="text-base font-semibold text-base-content font-subHeading">
                  Input
                </span>
              </div>
            </div>

            {/* Mobile header */}
            <div className="md:hidden flex items-center mb-3">
              <span className="text-sm font-semibold text-base-content font-subHeading">
                {selectedNumberFunction
                  ? isDouble
                    ? "Enter two numbers"
                    : isTextInput
                      ? "Enter a value"
                      : "Enter a number"
                  : "Select a function first"}
              </span>
            </div>

            <div className="flex flex-col gap-y-3">
              {/* Value 1 — text or number depending on function */}
              <div>
                {selectedNumberFunction && (
                  <label className="block text-xs font-semibold uppercase tracking-widest text-neutral-content mb-1.5 font-content">
                    {meta?.label1 ?? "Value"}
                  </label>
                )}

                {isTextInput ? (
                  /*
                   * InputText for string-input functions (HEX → Number, Binary → Number).
                   * onChange fires on every keystroke — no blur needed.
                   */
                  <InputText
                    disabled={!selectedNumberFunction}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className={`w-full h-12 px-4 text-base text-base-content font-content font-mono
                                bg-base-200 border-2 rounded-xl
                                focus:border-primary!
                                disabled:opacity-50 disabled:cursor-not-allowed
                                transition-colors duration-150
                                ${validationError ? "border-rose-400!" : "border-neutral"}`}
                    placeholder={meta?.placeholder1 ?? "Enter value…"}
                  />
                ) : (
                  /*
                   * InputNumber for numeric functions.
                   * FIX: onValueChange fires on every change (including typing),
                   * unlike onChange which only fires on commit. Combined with
                   * controlled local state this eliminates the blur requirement.
                   */
                  <InputNumber
                    disabled={!selectedNumberFunction}
                    value={inputVal1}
                    onValueChange={(e) => setInputVal1(e.value ?? 0)}
                    className="w-full"
                    inputClassName={`w-full h-12 px-4 text-base text-base-content font-content
                                    bg-base-200 border-2 rounded-xl
                                    focus:border-primary!
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                    transition-colors duration-150
                                    ${validationError ? "border-rose-400!" : "border-neutral"}`}
                    placeholder={
                      meta?.placeholder1 ??
                      (selectedNumberFunction
                        ? "Enter a number…"
                        : "Select a function first…")
                    }
                    format={false}
                    min={meta?.minVal}
                    useGrouping={false}
                  />
                )}
              </div>

              {/* Value 2 — only for double-input functions */}
              {isDouble && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-neutral-content mb-1.5 font-content">
                    {meta?.label2 ?? "Second value"}
                  </label>
                  <InputNumber
                    value={inputVal2}
                    onValueChange={(e) => setInputVal2(e.value ?? 0)}
                    className="w-full"
                    inputClassName={`w-full h-12 px-4 text-base text-base-content font-content
                                    bg-base-200 border-2 rounded-xl
                                    focus:border-primary!
                                    transition-colors duration-150
                                    ${validationError ? "border-rose-400!" : "border-neutral"}`}
                    placeholder={meta?.placeholder2 ?? "Enter second number…"}
                    format={false}
                    min={meta?.minVal}
                    useGrouping={false}
                  />
                </div>
              )}

              {/* Validation error */}
              {validationError && (
                <p className="text-xs text-rose-400 font-content flex items-center gap-1">
                  <span className="pi pi-exclamation-circle text-[11px]" />
                  {validationError}
                </p>
              )}
            </div>

            <div className="flex-1" />

            {/* Mobile "See result" shortcut */}
            {hasOutput && (
              <button
                type="button"
                onClick={() => setMobileTab("output")}
                className="md:hidden mt-3 w-full h-10 flex items-center justify-center gap-2
                           bg-base-300 border border-neutral rounded-xl
                           text-sm text-neutral-content font-subHeading
                           active:scale-95 transition-transform duration-100"
              >
                <span className="text-primary font-semibold">See result</span>
                <ArrowRight size={14} className="text-primary" />
              </button>
            )}
          </div>

          {/*
           * ── Desktop pipeline connector ──
           *
           * FIX for "weird separator with empty space on either side":
           * Changed from `items-stretch` (full height) to `items-start` on the
           * parent, so the connector only spans the natural height of the content
           * rather than stretching to fill dead vertical space. The line now
           * visually connects the two panels' content, not the whole viewport.
           *
           * The connector sits at the vertical midpoint of the input fields,
           * which is where the eye naturally looks for the relationship.
           */}
          <div className="hidden md:flex flex-col items-center gap-2 px-3 shrink-0 pt-9">
            <div className="h-6 w-px bg-neutral" />
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-7 h-7 rounded-full bg-base-300 border border-neutral flex items-center justify-center shrink-0">
                <ArrowRight size={14} className="text-neutral-content" />
              </div>
              {selectedNumberFunction && (
                <span
                  className="max-w-[64px] text-center text-[10px] leading-tight font-semibold text-primary font-content
                                 bg-base-300 border border-neutral rounded-lg px-1.5 py-1 break-words"
                >
                  {selectedNumberFunction}
                </span>
              )}
            </div>
            <div className="h-6 w-px bg-neutral" />
          </div>

          {/* ── Output panel ── */}
          <div
            className={`flex-col min-h-0 md:flex md:flex-1 ${mobileTab === "output" ? "flex flex-1" : "hidden"}`}
          >
            {/* Desktop header */}
            <div className="hidden md:flex items-center mb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-neutral text-base-content text-xs font-bold flex items-center justify-center shrink-0 font-content">
                  2
                </span>
                <span className="text-base font-semibold text-base-content font-subHeading">
                  Output
                </span>
              </div>
            </div>

            {/* Mobile header */}
            <div className="md:hidden flex items-center mb-3">
              <span className="text-sm font-semibold text-base-content font-subHeading">
                Result
              </span>
            </div>

            {/*
             * Output display.
             * Grows taller for Fibonacci (array output) which can be long.
             * Shows the function's output type as a subtle label so the user
             * understands what they're looking at (e.g. "boolean", "sequence", "hex").
             */}
            <div
              className={`w-full px-4 flex items-center
                         bg-base-300 border-2 border-neutral border-l-[3px] border-l-primary
                         rounded-xl font-content text-base-content
                         select-all cursor-default
                         ${outputIsArray ? "min-h-12 py-3 leading-relaxed" : "h-12"}`}
            >
              {hasOutput ? (
                <span
                  className={`${outputIsArray ? "text-sm break-words" : "text-lg font-semibold"} font-mono`}
                >
                  {outputVal}
                </span>
              ) : (
                <span className="text-neutral-content font-normal text-base italic">
                  Result will appear here…
                </span>
              )}
            </div>

            {/*
             * Output type badge — appears once there's a result.
             * Tells the user what kind of value they're looking at.
             */}
            {hasOutput && (
              <p className="text-[10px] text-neutral-content font-content mt-1 ml-1">
                {outputIsArray
                  ? `Sequence · ${outputVal.split(",").length} values`
                  : typeof outputVal === "string" &&
                      (outputVal === "true" || outputVal === "false")
                    ? `Boolean · ${outputVal === "true" ? "✓ Yes" : "✗ No"}`
                    : /^[0-9A-F]+$/i.test(outputVal) &&
                        selectedNumberFunction === "Number to HEX"
                      ? "Hexadecimal"
                      : selectedNumberFunction === "Number to Binary"
                        ? `Binary · ${outputVal.length} bits`
                        : "Integer"}
              </p>
            )}

            {/* Action bar */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <Button
                type="button"
                disabled={!hasOutput || outputIsArray}
                label="Use as Input"
                icon="pi pi-arrow-up"
                title={
                  outputIsArray
                    ? "Sequences can't be used as input"
                    : "Use output as new input"
                }
                className="h-9 px-4 text-sm text-primary-content bg-primary rounded-full border-transparent font-semibold
                           disabled:opacity-40 disabled:cursor-not-allowed
                           active:scale-95 transition-transform duration-100"
                onClick={handleUseAsInput}
              />
              <Button
                type="button"
                disabled={!hasOutput}
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
                disabled={!selectedNumberFunction || (!inputVal1 && !inputText)}
                icon="pi pi-bolt"
                aria-label="Re-run"
                title="Re-run function"
                className="h-9 w-9 text-neutral-content bg-transparent border border-neutral rounded-full
                           disabled:opacity-40 disabled:cursor-not-allowed
                           active:scale-95 transition-transform duration-100"
                onClick={() => {
                  if (isTextInput)
                    processNumber(selectedNumberFunction, inputText);
                  else if (isDouble)
                    processNumber(selectedNumberFunction, inputVal1, inputVal2);
                  else processNumber(selectedNumberFunction, inputVal1);
                }}
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

            {/* Mobile back shortcut */}
            <button
              type="button"
              onClick={() => setMobileTab("input")}
              className="md:hidden mt-2 w-full h-10 flex items-center justify-center gap-2
                         bg-base-300 border border-neutral rounded-xl
                         text-sm text-neutral-content font-subHeading
                         active:scale-95 transition-transform duration-100"
            >
              <ArrowRight
                size={14}
                className="text-neutral-content rotate-180"
              />
              <span>Back to input</span>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NumberManipulation;
