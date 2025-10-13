import { useState, useEffect } from "react";
import Layout from "../../Layout/Layout";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";

import { Dialog } from "primereact/dialog";
import { useForm } from "react-hook-form";
import { STRING_OPTIONS, stringFunctions } from "../../Services/Constants";
import useStringFunctionsStore from "../../Services/Stores/stringFunctionsStore";
import useToastStore from "../../Services/Stores/toastMessageStore";

const StringManipulation = () => {
  const { register, handleSubmit, reset, watch, setValue } = useForm();
  const showToast = useToastStore((state) => state.showToast);

  const { selectedStringFunction, setSelectedStringFunction } =
    useStringFunctionsStore();

  const [outputString, setOutputString] = useState("");
  const [showFunctionInfo, setShowFunctionInfo] = useState(false);

  const inputText = watch("inputText");

  // Auto-process when selection or input changes
  useEffect(() => {
    if (inputText && selectedStringFunction) {
      processString(inputText);
    }
  }, [selectedStringFunction, inputText]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        if (inputText) {
          processString(inputText);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [inputText, selectedStringFunction]);

  const processString = (inputString: string) => {
    const selectedFunction = stringFunctions[selectedStringFunction];
    if (selectedFunction && inputString) {
      const processedString = selectedFunction(inputString);
      setOutputString(processedString);
    }
  };

  const onSubmit = (data: any) => {
    processString(data.inputText);
  };

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
    const diff = outputString.length - inputText.length;
    return diff;
  };

  const getFunctionDefinition = () => {
    if (!selectedStringFunction) return null;

    const functionCode = stringFunctions[selectedStringFunction].toString();
    return functionCode;
  };

  const getFunctionDescription = () => {
    const descriptions: {
      [key: string]: { desc: string; example: string; result: string };
    } = {
      Reverse: {
        desc: "Reverses the order of characters in the string",
        example: "hello world",
        result: "dlrow olleh",
      },
      Uppercase: {
        desc: "Converts all characters to uppercase letters",
        example: "hello World",
        result: "HELLO WORLD",
      },
      Lowercase: {
        desc: "Converts all characters to lowercase letters",
        example: "Hello WORLD",
        result: "hello world",
      },
      "Title Case": {
        desc: "Capitalizes the first letter of each word",
        example: "hello world example",
        result: "Hello World Example",
      },
      "Sentence Case": {
        desc: "Capitalizes only the first letter of the first word",
        example: "hello world example",
        result: "Hello world example",
      },
      camelCase: {
        desc: "Converts string to camelCase (first letter lowercase, no spaces)",
        example: "hello world example",
        result: "helloWorldExample",
      },
      PascalCase: {
        desc: "Converts string to PascalCase (first letter uppercase, no spaces)",
        example: "hello world example",
        result: "HelloWorldExample",
      },
      "kebab-case": {
        desc: "Converts string to kebab-case (lowercase with hyphens)",
        example: "Hello World Example",
        result: "hello-world-example",
      },
      snake_case: {
        desc: "Converts string to snake_case (lowercase with underscores)",
        example: "Hello World Example",
        result: "hello_world_example",
      },
      SCREAMING_SNAKE_CASE: {
        desc: "Converts string to SCREAMING_SNAKE_CASE (uppercase with underscores)",
        example: "Hello World Example",
        result: "HELLO_WORLD_EXAMPLE",
      },
      "Alternate Case": {
        desc: "Alternates between uppercase and lowercase for each letter",
        example: "hello world",
        result: "HeLlO WoRlD",
      },
      "Randomize Case": {
        desc: "Randomly converts each character to uppercase or lowercase",
        example: "hello world",
        result: "HeLLo WOrLd (random each time)",
      },
      "Remove Spaces": {
        desc: "Removes all whitespace characters from the string",
        example: "hello   world  example",
        result: "helloworldexample",
      },
      Trim: {
        desc: "Removes leading and trailing whitespace only",
        example: "  hello world  ",
        result: "hello world",
      },
      "String to Binary": {
        desc: "Converts each character to its 8-bit binary representation",
        example: "ABC",
        result: "01000001 01000010 01000011",
      },
      "String to ASCII": {
        desc: "Converts each character to its ASCII code value",
        example: "ABC",
        result: "65, 66, 67",
      },
      "Remove Duplicates": {
        desc: "Removes consecutive duplicate characters",
        example: "helllo woorrld",
        result: "helo world",
      },
      "Count Characters": {
        desc: "Returns the total number of characters in the string",
        example: "hello world",
        result: "11",
      },
      "Count Words": {
        desc: "Returns the total number of words in the string",
        example: "hello world example",
        result: "3",
      },
      "Encode Base64": {
        desc: "Encodes the string to Base64 format",
        example: "hello world",
        result: "aGVsbG8gd29ybGQ=",
      },
      "Decode Base64": {
        desc: "Decodes a Base64 encoded string back to normal text",
        example: "aGVsbG8gd29ybGQ=",
        result: "hello world",
      },
      "URL Encode": {
        desc: "Encodes the string for safe use in URLs",
        example: "hello world!",
        result: "hello%20world%21",
      },
      "URL Decode": {
        desc: "Decodes a URL encoded string back to normal text",
        example: "hello%20world%21",
        result: "hello world!",
      },
    };

    const selected = descriptions[selectedStringFunction];

    return selected
      ? {
          description: selected.desc,
          example: `Example: "${selected.example}" → "${selected.result}"`,
        }
      : {
          description:
            "Transforms the input string based on the selected function",
          example: "",
        };
  };

  return (
    <Layout>
      {/* Function Info Dialog */}
      <Dialog
        header={
          <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl text-color5">
            Selected Function: {selectedStringFunction}
          </h2>
        }
        visible={showFunctionInfo}
        onHide={() => setShowFunctionInfo(false)}
        dismissableMask
        draggable={false}
        resizable={false}
        className="!absolute !bottom-0 sm:!bottom-auto w-full max-w-md !bg-color1 !rounded-3xl "
        headerClassName="!bg-transparent font-heading"
        contentClassName="!bg-transparent font-content"
      >
        <div className="flex flex-col gap-y-4 bg-transparent">
          <div>
            <h3 className="text-lg font-semibold text-color5 mb-2">
              Description
            </h3>
            <p className="text-base text-color4 font-content">
              {getFunctionDescription().description}
            </p>
          </div>

          {getFunctionDescription().example && (
            <div>
              <h3 className="text-lg font-semibold text-color5 mb-2">
                Example
              </h3>
              <p className="text-base text-color4 font-content bg-color2 p-3 rounded-lg border border-color3">
                {getFunctionDescription().example}
              </p>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold text-color5 mb-2">
              Function Code
            </h3>
            <pre className="p-4 bg-color2 border-2 border-color3 rounded-lg overflow-x-auto text-sm text-color5 ">
              {getFunctionDefinition()}
            </pre>
          </div>
        </div>
      </Dialog>

      <div className="w-full h-full p-2 md:p-3 lg:p-4 flex flex-col gap-y-3 md:gap-y-4 lg:gap-y-6 portrait:overflow-hidden landscape:overflow-y-auto md:overflow-y-auto custom-scrollbar">
        <div className="flex-shrink-0 flex flex-row items-center justify-between gap-4">
          <h1 className="text-2xl xs:text-3xl mdl:text-4xl text-color5 font-heading select-none">
            Play with Strings
          </h1>
          <Button
            type="button"
            disabled={!inputText && !outputString}
            title="Clear everything (Ctrl/Cmd + Shift + X)"
            icon={"pi pi-times"}
            label={"Clear All"}
            className="w-fit h-9 md:h-10 px-4 py-2 text-color4 text-sm md:text-base bg-transparent font-content border sm:border-2 border-color4 rounded-full"
            onClick={handleClearAll}
          />
        </div>

        <div className="flex-shrink-0 w-full flex flex-col gap-y-2">
          <label
            htmlFor="stringFunction"
            className="text-lg xs:text-xl text-color4 font-subHeading select-none"
          >
            Choose a function
          </label>
          <div className="flex items-center gap-2">
            <Dropdown
              name="stringFunction"
              value={selectedStringFunction}
              onChange={(e) => setSelectedStringFunction(e.value)}
              options={STRING_OPTIONS}
              placeholder="Select a string function"
              filter
              filterPlaceholder="Search functions..."
              className="flex-1 md:flex-none md:w-1/2 lg:w-1/3 h-9 sm:h-10 !rounded-lg !bg-color2 border sm:border-2 !border-color4 *:py-2 *:text-color5 *:text-sm"
              panelClassName="text-sm md:text-base font-content mt-2 rounded-lg"
            />
            <Button
              type="button"
              icon="pi pi-info-circle"
              disabled={!selectedStringFunction}
              tooltip="View function details"
              tooltipOptions={{ position: "top" }}
              className="h-9 sm:h-10 w-9 sm:w-10 p-0 flex items-center justify-center text-color4 bg-transparent border sm:border-2 border-color4 rounded-lg"
              onClick={() => setShowFunctionInfo(true)}
            />
          </div>
        </div>

        <div className="portrait:flex-1 portrait:min-h-0 landscape:flex-none grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 lg:gap-6 xl:gap-8 portrait:overflow-hidden landscape:overflow-visible md:overflow-visible">
          <form
            className="flex flex-col gap-y-3 md:gap-y-4 portrait:min-h-0 landscape:min-h-0"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-y-2 md:gap-y-3 portrait:flex-1 portrait:min-h-0 landscape:flex-none">
              <div className="flex-shrink-0 flex items-center justify-between">
                <label className="text-lg xs:text-xl text-color4 font-subHeading select-none">
                  Enter Input String
                </label>
                <p className="text-sm xs:text-base text-color2 font-content select-none">
                  {inputText?.length ? inputText.length : "0"}/3500
                </p>
              </div>
              <InputTextarea
                disabled={selectedStringFunction === ""}
                className="custom-scrollbar portrait:flex-1 portrait:min-h-0 portrait:h-full landscape:min-h-[180px] landscape:h-auto md:h-auto md:min-h-[250px] p-4 text-base xs:text-lg mdl:text-xl text-color5 font-content border-2 border-color3 bg-color2 rounded-xl mdl:rounded-2xl resize-none"
                maxLength={3500}
                placeholder={
                  selectedStringFunction === ""
                    ? "Select a function from dropdown first to continue"
                    : "Enter your text here..."
                }
                {...register("inputText", { required: true })}
              />
            </div>
            <div className="flex-shrink-0 h-9 md:h-10 flex items-center gap-x-3">
              <Button
                type="button"
                disabled={!inputText}
                title="Click to remove input text"
                icon={"pi pi-trash"}
                label={"Discard"}
                className="h-full px-4 text-sm md:text-base text-color4 bg-transparent font-content border sm:border-2 border-color4 rounded-full"
                onClick={() => reset()}
              />
              <Button
                type="submit"
                disabled={!inputText || !selectedStringFunction}
                title="Click to process (Ctrl/Cmd + Enter)"
                icon={"pi pi-check"}
                label={"Continue"}
                className="h-full px-4 text-sm md:text-base text-color1 bg-color4 font-content rounded-full"
              />
            </div>
          </form>

          <form className="flex flex-col gap-y-3 md:gap-y-4 portrait:min-h-0 landscape:min-h-0">
            <div className="flex flex-col gap-y-2 md:gap-y-3 portrait:flex-1 portrait:min-h-0 landscape:flex-none">
              <div className="flex-shrink-0 flex items-center justify-between">
                <label className="text-lg xs:text-xl text-color4 font-subHeading select-none">
                  Your Output String
                </label>
                <p className="text-sm xs:text-base text-color2 font-content select-none">
                  {outputString?.length}/3500
                  {getCharacterDifference() !== null && (
                    <span
                      className={
                        getCharacterDifference()! > 0
                          ? "text-green-500 ml-1"
                          : "text-red-500 ml-1"
                      }
                    >
                      ({getCharacterDifference()! > 0 ? "+" : ""}
                      {getCharacterDifference()})
                    </span>
                  )}
                </p>
              </div>
              <InputTextarea
                disabled={
                  selectedStringFunction === "" || inputText?.trim()?.length < 1
                }
                value={outputString}
                className="custom-scrollbar portrait:flex-1 portrait:min-h-0 portrait:h-full landscape:min-h-[180px] landscape:h-auto md:h-auto md:min-h-[250px] p-4 text-base xs:text-lg mdl:text-xl text-color5 font-content border-2 border-color3 bg-color2 rounded-xl mdl:rounded-2xl resize-none"
                placeholder="Output will appear here..."
                readOnly
              />
            </div>
            <div className="flex-shrink-0 h-9 md:h-10 lg:h-11 flex flex-row items-center gap-x-3">
              <Button
                type="button"
                disabled={!outputString}
                title="Use output as new input"
                icon={"pi pi-arrow-up"}
                label={"Use as Input"}
                className="h-full px-4 text-sm md:text-base text-color1 bg-color4 font-content rounded-full line-clamp-1"
                onClick={handleUseAsInput}
              />
              <Button
                type="button"
                disabled={!outputString}
                title="Click to remove output"
                icon={"pi pi-trash"}
                label={"Discard"}
                className="h-full px-4 text-sm md:text-base text-color4 bg-transparent font-content border sm:border-2 border-color4 rounded-full"
                onClick={() => setOutputString("")}
              />
              <Button
                type="button"
                disabled={!outputString}
                title="Copy output to clipboard"
                icon={"pi pi-copy"}
                label={"Copy"}
                className="h-full px-4 text-sm md:text-base text-color4 bg-transparent font-content border sm:border-2 border-color4 rounded-full"
                onClick={handleCopy}
              />
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default StringManipulation;
