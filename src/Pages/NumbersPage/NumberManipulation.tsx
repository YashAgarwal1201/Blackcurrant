import { useState, useEffect } from "react";
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

const NumberManipulation = () => {
  const { handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: { inputVal1: 0, inputVal2: 0 },
    mode: "onChange",
  });

  const showToast = useToastStore((state) => state.showToast);
  const { selectedNumberFunction, setSelectedNumberFunction } =
    useNumberFunctionsStore();

  const [outputVal, setOutputVal] = useState<string | number>("");
  const [showFunctionInfo, setShowFunctionInfo] = useState(false);

  const inputVal1 = watch("inputVal1");
  const inputVal2 = watch("inputVal2");

  const isDoubleInput =
    selectedNumberFunction === "Greatest Common Divisor" ||
    selectedNumberFunction === "Least Common Multiple";

  // Auto-process when selection or input changes
  useEffect(() => {
    if (selectedNumberFunction) {
      if (isDoubleInput && (inputVal1 || inputVal2)) {
        processNumber(inputVal1, inputVal2);
      } else if (!isDoubleInput && inputVal1 !== null) {
        processNumber(inputVal1);
      }
    }
  }, [selectedNumberFunction, inputVal1, inputVal2]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        if (isDoubleInput) {
          processNumber(inputVal1, inputVal2);
        } else {
          processNumber(inputVal1);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [selectedNumberFunction, inputVal1, inputVal2]);

  const processNumber = (input1: number, input2?: number) => {
    const selectedFunction = numberFunctions[selectedNumberFunction];
    if (selectedFunction) {
      const result = isDoubleInput
        ? selectedFunction(input1 || 0, input2 || 0)
        : selectedFunction(input1 || 0);
      setOutputVal(result);
    }
  };

  const onSubmit = (data: any) => {
    if (isDoubleInput) {
      processNumber(data.inputVal1, data.inputVal2);
    } else {
      processNumber(data.inputVal1);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputVal?.toString() || "");
    showToast("success", "Copied", "Output copied to clipboard");
  };

  const handleUseAsInput = () => {
    setValue("inputVal1", Number(outputVal) || 0);
    if (isDoubleInput) {
      setValue("inputVal2", 0);
    }
    showToast("info", "Input Updated", "Output transferred to input");
  };

  const handleClearAll = () => {
    reset();
    setOutputVal("");
    showToast("info", "Cleared", "All fields have been cleared");
  };

  const getFunctionDefinition = () => {
    if (!selectedNumberFunction) return null;
    return numberFunctions[selectedNumberFunction].toString();
  };

  const getFunctionDescription = () => {
    const descriptions: { [key: string]: string } = {
      Factorial:
        "Calculates the product of all positive integers up to the given number",
      Fibonacci: "Returns the nth number in the Fibonacci sequence",
      "Is Prime": "Checks whether the given number is a prime number",
      Square: "Calculates the square of the given number (n²)",
      "Square Root": "Calculates the square root of the given number (√n)",
      Cube: "Calculates the cube of the given number (n³)",
      "Cube Root": "Calculates the cube root of the given number (∛n)",
      "Absolute Value": "Returns the absolute (positive) value of the number",
      "Is Even": "Checks whether the number is even",
      "Is Odd": "Checks whether the number is odd",
      "Greatest Common Divisor":
        "Finds the largest positive integer that divides both numbers",
      "Least Common Multiple":
        "Finds the smallest positive integer that is divisible by both numbers",
      "Power of 2": "Calculates 2 raised to the power of the given number (2ⁿ)",
      "Power of 10":
        "Calculates 10 raised to the power of the given number (10ⁿ)",
      Round: "Rounds the number to the nearest integer",
      Floor: "Rounds the number down to the nearest integer",
      Ceiling: "Rounds the number up to the nearest integer",
    };

    return (
      descriptions[selectedNumberFunction] ||
      "Performs a mathematical operation on the input number(s)"
    );
  };

  return (
    <Layout>
      {/* Function Info Dialog */}
      <Dialog
        header={
          <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl text-color5">
            Selected Function: {selectedNumberFunction}
          </h2>
        }
        visible={showFunctionInfo}
        onHide={() => setShowFunctionInfo(false)}
        dismissableMask
        draggable={false}
        resizable={false}
        className="absolute! bottom-0! sm:bottom-auto! w-full max-w-md bg-color1! rounded-3xl! "
        headerClassName="bg-transparent! font-heading"
        contentClassName="bg-transparent! font-content"
      >
        <div className="flex flex-col gap-y-4">
          <div>
            <h3 className="text-lg font-semibold text-color5 mb-2">
              Description
            </h3>
            <p className="text-base text-color4 font-content">
              {getFunctionDescription()}
            </p>
          </div>

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
        <div className="shrink-0 flex flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-x-1">
            <GoBackBtn />
            <h1 className="text-2xl xs:text-3xl mdl:text-4xl text-color5 font-heading select-none">
              Play with Numbers
            </h1>
          </div>
          <Button
            type="button"
            disabled={!inputVal1 && !inputVal2 && !outputVal}
            title="Clear everything (Ctrl/Cmd + Shift + X)"
            icon="pi pi-times"
            label="Clear All"
            className="w-fit h-9 md:h-10 px-4 py-2 text-color4 text-sm md:text-base bg-transparent font-content border sm:border-2 border-color4 rounded-full"
            onClick={handleClearAll}
          />
        </div>

        <div className="shrink-0 w-full flex flex-col gap-y-2">
          <label
            htmlFor="numberFunction"
            className="text-lg xs:text-xl text-color4 font-subHeading select-none"
          >
            Choose a function
          </label>
          <div className="flex items-center gap-2">
            <Dropdown
              name="numberFunction"
              value={selectedNumberFunction}
              onChange={(e) => setSelectedNumberFunction(e.value)}
              options={NUMBER_OPTIONS}
              placeholder="Select a number function"
              filter
              filterPlaceholder="Search functions..."
              className="flex-1 md:flex-none md:w-1/2 lg:w-1/3 h-9 sm:h-10 rounded-lg! bg-transparent! border sm:border-2 border-color4! *:py-2 *:text-color4 *:text-sm"
              panelClassName="bg-color2! border! border-white! rounded-lg! !p-2"
            />
            <Button
              type="button"
              icon="pi pi-info-circle"
              disabled={!selectedNumberFunction}
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
              <div className="flex flex-col gap-y-3">
                <div>
                  <label className="text-lg xs:text-xl text-color4 font-subHeading select-none block mb-2">
                    Input Value 1
                  </label>
                  <InputNumber
                    disabled={selectedNumberFunction === ""}
                    value={inputVal1}
                    onValueChange={(e) => setValue("inputVal1", e.value ?? 0)}
                    className="w-full"
                    inputClassName="w-full h-12 md:h-14 px-4 text-base md:text-lg text-color5 font-content border-2 border-color3 bg-color2 rounded-lg"
                    placeholder={
                      selectedNumberFunction === ""
                        ? "Select a function first"
                        : "Enter first number..."
                    }
                    format={false}
                  />
                </div>

                {isDoubleInput && (
                  <div>
                    <label className="text-lg xs:text-xl text-color4 font-subHeading select-none block mb-2">
                      Input Value 2
                    </label>
                    <InputNumber
                      disabled={(selectedNumberFunction as any) === ""}
                      value={inputVal2}
                      onValueChange={(e) => setValue("inputVal2", e.value ?? 0)}
                      className="w-full"
                      inputClassName="w-full h-12 md:h-14 px-4 text-base md:text-lg text-color5 font-content border-2 border-color3 bg-color2 rounded-lg"
                      placeholder="Enter second number..."
                      format={false}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="shrink-0 h-9 md:h-10 flex items-center gap-x-3">
              <Button
                type="button"
                disabled={!inputVal1 && !inputVal2}
                title="Click to remove input values"
                icon="pi pi-trash"
                label="Discard"
                className="h-full px-4 text-sm md:text-base text-color4 bg-transparent font-content border sm:border-2 border-color4 rounded-full"
                onClick={() => reset()}
              />
              <Button
                type="submit"
                disabled={!selectedNumberFunction}
                title="Click to process (Ctrl/Cmd + Enter)"
                icon="pi pi-check"
                label="Continue"
                className="h-full px-4 text-sm md:text-base text-color1 bg-color4 font-content rounded-full"
              />
            </div>
          </form>

          <form className="flex flex-col gap-y-3 md:gap-y-4 portrait:min-h-0 landscape:min-h-0">
            <div className="flex flex-col gap-y-2 md:gap-y-3 portrait:flex-1 portrait:min-h-0 landscape:flex-none">
              <label className="text-lg xs:text-xl text-color4 font-subHeading select-none">
                Your Output Result
              </label>
              <InputText
                disabled={
                  selectedNumberFunction === "" || (!inputVal1 && !inputVal2)
                }
                value={outputVal?.toString() || ""}
                className="w-full h-12 md:h-14 px-4 text-base md:text-lg text-color5 font-content border-2 border-color3 bg-color2 rounded-lg"
                placeholder="Result will appear here..."
                readOnly
              />
            </div>

            <div className="shrink-0 h-9 md:h-10 lg:h-11 flex flex-row items-center gap-x-3">
              <Button
                type="button"
                disabled={!outputVal && outputVal !== 0}
                title="Use output as new input"
                className="h-full px-3 md:px-4 flex items-center gap-x-2 text-sm md:text-base text-color1 bg-color4 font-content rounded-full"
                onClick={handleUseAsInput}
              >
                <span className="pi pi-arrow-up"></span>
                <span className="line-clamp-1">Use as Input</span>
              </Button>
              <Button
                type="button"
                disabled={!outputVal && outputVal !== 0}
                title="Click to remove output"
                icon="pi pi-trash"
                label="Discard"
                className="h-full px-4 text-sm md:text-base text-color4 bg-transparent font-content border sm:border-2 border-color4 rounded-full"
                onClick={() => setOutputVal("")}
              />
              <Button
                type="button"
                disabled={!outputVal && outputVal !== 0}
                title="Copy output to clipboard"
                icon="pi pi-copy"
                label="Copy"
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

export default NumberManipulation;
