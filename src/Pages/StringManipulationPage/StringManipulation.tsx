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
import { X } from "lucide-react";

const StringManipulation = () => {
  const { register, handleSubmit, reset, watch, setValue } = useForm();
  const showToast = useToastStore((state) => state.showToast);
  const { selectedStringFunction, setSelectedStringFunction } =
    useStringFunctionsStore();

  const [outputString, setOutputString] = useState("");
  const [showFunctionInfo, setShowFunctionInfo] = useState(false);

  const inputText = watch("inputText");

  useEffect(() => {
    if (inputText && selectedStringFunction) processString(inputText);
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
    showToast("info", "Input Updated", "Output transferred to input");
  };

  const handleClearAll = () => {
    reset();
    setOutputString("");
    showToast("info", "Cleared", "All fields have been cleared");
  };

  const getCharacterDifference = () => {
    if (!inputText || !outputString) return null;
    return outputString.length - inputText.length;
  };

  const getFunctionDefinition = () => {
    if (!selectedStringFunction) return null;
    return stringFunctions[selectedStringFunction].toString();
  };

  const getFunctionDescription = () => {
    const descriptions: {
      [key: string]: { desc: string; example: string; result: string };
    } = {
      Reverse: {
        desc: "Reverses the order of characters",
        example: "hello",
        result: "olleh",
      },
      Uppercase: {
        desc: "Converts to uppercase",
        example: "hello",
        result: "HELLO",
      },
      Lowercase: {
        desc: "Converts to lowercase",
        example: "HELLO",
        result: "hello",
      },
      "Title Case": {
        desc: "Capitalizes first letter of words",
        example: "hello world",
        result: "Hello World",
      },
      "Sentence Case": {
        desc: "Capitalizes first letter of string",
        example: "hello world",
        result: "Hello world",
      },
      camelCase: {
        desc: "lowerCamelCase format",
        example: "hello world",
        result: "helloWorld",
      },
      PascalCase: {
        desc: "UpperCamelCase format",
        example: "hello world",
        result: "HelloWorld",
      },
      "kebab-case": {
        desc: "Hyphenated lowercase",
        example: "Hello World",
        result: "hello-world",
      },
      snake_case: {
        desc: "Underscored lowercase",
        example: "Hello World",
        result: "hello_world",
      },
      SCREAMING_SNAKE_CASE: {
        desc: "Underscored uppercase",
        example: "Hello World",
        result: "HELLO_WORLD",
      },
      "Alternate Case": {
        desc: "Alternates casing",
        example: "hello",
        result: "HeLlO",
      },
      "Randomize Case": {
        desc: "Randomizes casing",
        example: "hello",
        result: "hElLo",
      },
      "Remove Spaces": {
        desc: "Removes all whitespace",
        example: "a b c",
        result: "abc",
      },
      Trim: {
        desc: "Removes leading/trailing whitespace",
        example: "  a  ",
        result: "a",
      },
      "String to Binary": {
        desc: "Binary representation",
        example: "A",
        result: "01000001",
      },
      "String to ASCII": {
        desc: "ASCII code values",
        example: "A",
        result: "65",
      },
      "Remove Duplicates": {
        desc: "Removes consecutive duplicates",
        example: "aaabb",
        result: "ab",
      },
      "Count Characters": {
        desc: "Total character count",
        example: "abc",
        result: "3",
      },
      "Count Words": {
        desc: "Total word count",
        example: "hello world",
        result: "2",
      },
      "Encode Base64": {
        desc: "Base64 encoding",
        example: "hello",
        result: "aGVsbG8=",
      },
      "Decode Base64": {
        desc: "Base64 decoding",
        example: "aGVsbG8=",
        result: "hello",
      },
      "URL Encode": {
        desc: "URL safe encoding",
        example: "a b",
        result: "a%20b",
      },
      "URL Decode": { desc: "URL decoding", example: "a%20b", result: "a b" },
    };
    const selected = descriptions[selectedStringFunction];
    return selected
      ? {
          description: selected.desc,
          example: `Example: "${selected.example}" → "${selected.result}"`,
        }
      : { description: "Transforms the input string", example: "" };
  };

  return (
    <Layout>
      <Dialog
        header={
          <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl text-base-content">
            {selectedStringFunction}
          </h2>
        }
        visible={showFunctionInfo}
        onHide={() => setShowFunctionInfo(false)}
        dismissableMask
        draggable={false}
        resizable={false}
        // base-200 dialog shell, base-300 inner card — clear two-step elevation
        className="absolute! bottom-0! sm:bottom-auto! w-full max-w-md bg-base-200 rounded-3xl!"
        headerClassName="bg-transparent! font-heading"
        contentClassName="bg-transparent! font-content"
        closeIcon={<X size={24} className="text-base-content" />}
      >
        <div className="flex flex-col gap-y-4 text-base-content bg-base-300 rounded-3xl p-4">
          <div>
            <h3 className="text-lg font-semibold text-base-content mb-2">
              Description
            </h3>
            <p className="text-base text-neutral-content font-content">
              {getFunctionDescription().description}
            </p>
          </div>
          {getFunctionDescription().example && (
            <div>
              <h3 className="text-lg font-semibold text-base-content mb-2">
                Example
              </h3>
              <p className="text-base text-base-content font-content bg-base-200 p-3 rounded-lg border border-neutral">
                {getFunctionDescription().example}
              </p>
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-base-content mb-2">
              Function Code
            </h3>
            {/* base-100 = deepest surface, max contrast for code */}
            <pre className="p-4 bg-base-100 border-2 border-neutral rounded-lg overflow-x-auto text-sm text-base-content">
              {getFunctionDefinition()}
            </pre>
          </div>
        </div>
      </Dialog>

      {/*
       * LAYOUT FIX: h-full + flex flex-col so the grid below can grow
       * to fill the available viewport height instead of collapsing
       */}
      <div className="w-full h-full p-2 md:p-3 lg:p-4 flex flex-col gap-y-3 md:gap-y-4 lg:gap-y-6">
        {/* ── Header row ── */}
        <div className="w-full shrink-0 flex flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-x-1">
            <GoBackBtn />
            <h1 className="text-2xl xs:text-3xl mdl:text-4xl text-primary font-heading select-none">
              Play with Strings
            </h1>
          </div>
          <Button
            type="button"
            disabled={!inputText && !outputString}
            icon="pi pi-times"
            label="Clear All"
            className="h-9 md:h-10 px-4 text-base-content bg-transparent border-2 border-neutral rounded-full hover:bg-base-200 transition-colors"
            onClick={handleClearAll}
          />
        </div>

        {/* ── Function picker row ── */}
        <div className="shrink-0 w-full flex flex-col gap-y-2">
          <label className="text-lg xs:text-xl text-base-content font-subHeading">
            Choose a function
          </label>
          <div className="flex items-center gap-2">
            {/*
             * LAYOUT FIX: dropdown fills available width on all breakpoints.
             * Arbitrary w-1/3 left a dead zone — now it stretches naturally
             * and the info button anchors to the right.
             */}
            <Dropdown
              value={selectedStringFunction}
              onChange={(e) => setSelectedStringFunction(e.value)}
              options={STRING_OPTIONS}
              placeholder="Select a string function"
              filter
              className="flex-1 h-10 bg-base-300! border-neutral! rounded-lg! text-base-content"
              panelClassName="bg-base-300 border-neutral rounded-lg"
            />
            <Button
              type="button"
              icon="pi pi-info-circle"
              disabled={!selectedStringFunction}
              className="shrink-0 h-10 w-10 text-base-content bg-base-300 border-2 border-neutral rounded-lg hover:bg-neutral transition-colors"
              onClick={() => setShowFunctionInfo(true)}
            />
          </div>
        </div>

        {/*
         * LAYOUT FIX: flex-1 + min-h-0 lets this grid grow to fill remaining
         * height, eliminating the dead black space below the buttons.
         * Each column is also flex flex-col so textareas can stretch.
         */}
        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* ── Input panel ── */}
          <form
            className="flex flex-col gap-y-3 min-h-0"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex-1 min-h-0 flex flex-col gap-y-2">
              <div className="flex items-center justify-between shrink-0">
                <label className="text-lg text-base-content font-subHeading">
                  Input String
                </label>
                <p className="text-sm text-neutral-content">
                  {inputText?.length || 0}/3500
                </p>
              </div>
              {/*
               * flex-1 + h-full lets the textarea fill the panel height.
               * border-neutral replaces border-base-300 — neutral (#3d2d52)
               * is visibly distinct from the base-300 bg (#221830).
               */}
              <InputTextarea
                disabled={!selectedStringFunction}
                className="flex-1 h-full p-4 text-base-content bg-base-200 border-2 border-neutral rounded-2xl focus:border-primary transition-all resize-none"
                placeholder={
                  selectedStringFunction
                    ? "Enter text..."
                    : "Select function first..."
                }
                {...register("inputText")}
              />
            </div>
            <div className="shrink-0 flex items-center gap-x-3">
              <Button
                type="button"
                disabled={!inputText}
                label="Discard"
                icon="pi pi-trash"
                className="h-10 px-4 text-base-content bg-transparent border-2 border-neutral rounded-full hover:bg-base-200 transition-colors"
                onClick={() => reset()}
              />
              <Button
                type="submit"
                disabled={!inputText || !selectedStringFunction}
                label="Continue"
                icon="pi pi-check"
                className="h-10 px-6 text-primary-content bg-primary rounded-full border-transparent"
              />
            </div>
          </form>

          {/* ── Output panel ── */}
          <div className="flex flex-col gap-y-3 min-h-0">
            <div className="flex-1 min-h-0 flex flex-col gap-y-2">
              <div className="flex items-center justify-between shrink-0">
                <label className="text-lg text-base-content font-subHeading">
                  Output String
                </label>
                <p className="text-sm text-neutral-content">
                  {outputString?.length || 0}/3500
                  {getCharacterDifference() !== null && (
                    <span
                      className={
                        getCharacterDifference()! >= 0
                          ? "text-green-400 ml-1"
                          : "text-red-400 ml-1"
                      }
                    >
                      ({getCharacterDifference()! >= 0 ? "+" : ""}
                      {getCharacterDifference()})
                    </span>
                  )}
                </p>
              </div>
              {/*
               * Output sits on base-300 (darker than input's base-200) — the
               * extra step signals read-only without any extra labelling.
               * Left border in primary color is a strong read-only cue used
               * in many design systems (VS Code, Linear, Notion).
               */}
              <InputTextarea
                readOnly
                value={outputString}
                className="flex-1 h-full p-4 text-base-content bg-base-300 border-2 border-l-4 border-neutral border-l-primary rounded-2xl italic resize-none"
                placeholder="Output will appear here..."
              />
            </div>
            <div className="shrink-0 flex flex-wrap items-center gap-2">
              <Button
                type="button"
                disabled={!outputString}
                label="Use as Input"
                icon="pi pi-arrow-up"
                className="h-10 px-4 text-primary-content bg-primary rounded-full font-bold"
                onClick={handleUseAsInput}
              />
              <Button
                type="button"
                disabled={!outputString}
                label="Copy"
                icon="pi pi-copy"
                className="h-10 px-4 text-base-content bg-transparent border-2 border-neutral rounded-full hover:bg-base-200 transition-colors"
                onClick={handleCopy}
              />
              <Button
                type="button"
                disabled={!outputString}
                icon="pi pi-trash"
                className="h-10 w-10 text-red-400 bg-transparent border-2 border-neutral rounded-full hover:bg-base-200 transition-colors"
                onClick={() => setOutputString("")}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StringManipulation;
