import { useState } from "react";
import Layout from "../../Layout/Layout";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { useForm } from "react-hook-form";
import { STRING_OPTIONS, stringFunctions } from "../../Services/Constants";
import useStringFunctionsStore from "../../Services/Stores/stringFunctionsStore";

const StringManipulation = () => {
  const { register, handleSubmit, reset, watch } = useForm();

  const { selectedStringFunction, setSelectedStringFunction } =
    useStringFunctionsStore(); // Access Zustand store

  const [outputString, setOutputString] = useState("");

  const inputText = watch("inputText");

  // Function to handle form submission
  const onSubmit = (data: any) => {
    const inputString = data.inputText;
    const selectedFunction = stringFunctions[selectedStringFunction];

    if (selectedFunction) {
      const processedString = selectedFunction(inputString);
      setOutputString(processedString);
    }
  };

  return (
    <Layout>
      <div className="custom-scrollbar w-full h-full p-2 md:p-3 lg:p-4 flex flex-col gap-y-4 sm:pa-y-6 md:gap-y-10 overflow-y-auto">
        <h1 className="text-2xl xs:text-3xl mdl:text-4xl text-color5 font-heading select-none">
          String Manipulation
        </h1>

        <div className="h-8 md:h-9 lg:h-10 flex flex-nowrap justify-start items-center gap-x-2 md:gap-x-3 overflow-x-auto">
          {STRING_OPTIONS?.map((value, key) => (
            <Button
              key={key}
              label={value}
              // className="h-full px-5 flex-grow flex-shrink-0 text-xs sm:text-sm md:text-base lg:text-lg text-color4 font-content bg-transparent rounded-full border md:border-2 border-color4"
              className={`h-full px-5 flex-grow flex-shrink-0 text-xs sm:text-sm md:text-base lg:text-lg font-content rounded-full border md:border-2 ${
                selectedStringFunction === value
                  ? "bg-color4 text-color1 border-color4"
                  : "bg-transparent text-color4 border-color4"
              }`}
              onClick={() => setSelectedStringFunction(value)}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 xl:gap-8">
          <div className="">
            <form
              className="flex flex-col gap-y-3 md:gap-y-5 mdl:gap-y-10"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="flex flex-col gap-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-lg xs:text-xl text-color4 font-subHeading select-none">
                    Input String
                  </label>
                  <p className="block md:hidden text-sm xs:text-base xl:text-lg text-color2 font-content select-none">
                    {inputText?.length ? inputText.length : "0"}/3500
                  </p>
                </div>
                <InputTextarea
                  className="h-[27vh] md:h-[40vh] p-4 text-base xs:text-lg mdl:text-xl text-color5 font-content border-2 border-color3 bg-color2 rounded-xl mdl:rounded-2xl resize-none"
                  maxLength={3500}
                  {...register("inputText", { required: true })}
                />
                <p className="hidden md:block ml-auto text-sm xs:text-base xl:text-lg text-color2 font-content select-none">
                  {inputText?.length ? inputText.length : "0"}/3500
                </p>
              </div>
              <div className="h-9 md:h-10 lg:h-11 flex items-center gap-x-3">
                <Button
                  type="button"
                  disabled={!inputText}
                  title="Click to remove everything"
                  icon={"pi pi-trash"}
                  label={"Discard"}
                  className="h-full px-5 text-sm md:text-base lg:text-lg text-color4 bg-transparent font-content border-1 sm:border-2 border-color4 rounded-full"
                  onClick={() => reset()}
                />
                <Button
                  type="submit"
                  disabled={!inputText}
                  title="Click to proceed"
                  icon={"pi pi-check"}
                  label={"Continue"}
                  className="h-full px-5 text-sm md:text-base lg:text-lg text-color1 bg-color4 font-content rounded-full"
                />
              </div>
            </form>
          </div>

          <div className="">
            <form className="flex flex-col gap-y-3 md:gap-y-5 mdl:gap-y-10">
              <div className="flex flex-col gap-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-lg xs:text-xl text-color4 font-subHeading select-none">
                    Output String
                  </label>
                  <p className="block md:hidden text-sm xs:text-base xl:text-lg text-color2 font-content select-none">
                    {outputString?.length}/3500
                  </p>
                </div>
                <InputTextarea
                  value={outputString}
                  className="h-[27vh] md:h-[40vh] p-4 text-base xs:text-lg mdl:text-xl text-color5 font-content border-2 border-color3 bg-color2 rounded-xl mdl:rounded-2xl resize-none"
                  readOnly
                />
                <p className="hidden md:block ml-auto text-sm xs:text-base xl:text-lg text-color2 font-content select-none">
                  {outputString?.length}/3500
                </p>
              </div>
              <div className="h-9 md:h-10 lg:h-11 flex flex-row sm:flex-row-reverse items-center gap-x-3">
                <Button
                  type="button"
                  disabled={!outputString}
                  title="Click to remove everything"
                  icon={"pi pi-trash"}
                  label={"Discard"}
                  className="h-full px-5 text-sm md:text-base lg:text-lg text-color4 bg-transparent font-content border-1 sm:border-2 border-color4 rounded-full"
                  onClick={() => setOutputString("")}
                />
                <Button
                  type="button"
                  disabled={!outputString}
                  title="Click to proceed"
                  icon={"pi pi-copy"}
                  label={"Copy"}
                  className="h-full px-5 text-sm md:text-base lg:text-lg text-color1 bg-color4 font-content rounded-full"
                  onClick={() => navigator.clipboard.writeText(outputString)}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StringManipulation;
