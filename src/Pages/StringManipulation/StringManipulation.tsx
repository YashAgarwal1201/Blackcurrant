import { useState } from "react";
import Layout from "../../Layout/Layout";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { useForm } from "react-hook-form";
import { alternateCase } from "../../Services/StringFunctions";

const StringManipulation = () => {
  const { register, handleSubmit, reset, watch } = useForm();
  const [outputString, setOutputString] = useState("");

  const inputText = watch("inputText");

  // Function to handle form submission
  const onSubmit = (data: any) => {
    const inputString = data.inputText;
    // Process the string (example: just echoing it back here, but you can manipulate it as needed)
    const pr = alternateCase(inputString);
    setOutputString(pr);
  };

  return (
    <Layout>
      <div className="custom-scrollbar w-full h-full p-1 xs:p-2 md:p-3 lg:p-4 flex flex-col gap-y-4 sm:pa-y-6 md:gap-y-10 overflow-y-auto">
        <h1 className="text-2xl xs:text-3xl mdl:text-4xl text-color5 font-heading">
          String Manipulation
        </h1>

        <div></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 xl:gap-8">
          <div className="">
            <form
              className="flex flex-col gap-y-3 md:gap-y-5 mdl:gap-y-10"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="flex flex-col gap-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-lg xs:text-xl text-color4 font-subHeading">
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
              <div className="h-10 md:h-11 flex items-center gap-x-3">
                <Button
                  type="button"
                  disabled={!inputText}
                  title="Click to remove everything"
                  icon={"pi pi-trash"}
                  label={"Discard"}
                  className="h-full px-5 text-base xs:text-lg text-color4 bg-transparent font-content border-1 sm:border-2 border-color4 rounded-full"
                  onClick={() => reset()}
                />
                <Button
                  type="submit"
                  disabled={!inputText}
                  title="Click to proceed"
                  icon={"pi pi-send"}
                  label={"Continue"}
                  className="h-full px-5 text-base xs:text-lg text-color1 bg-color4 font-content rounded-full"
                />
              </div>
            </form>
          </div>

          <div className="">
            <form className="flex flex-col gap-y-3 md:gap-y-5 mdl:gap-y-10">
              <div className="flex flex-col gap-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-lg xs:text-xl text-color4 font-subHeading">
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
              <div className="h-10 md:h-11 flex flex-row sm:flex-row-reverse items-center gap-x-3">
                <Button
                  type="button"
                  disabled={!outputString}
                  title="Click to remove everything"
                  icon={"pi pi-trash"}
                  label={"Discard"}
                  className="h-full px-5 text-base xs:text-lg text-color4 bg-transparent font-content border-1 sm:border-2 border-color4 rounded-full"
                  onClick={() => setOutputString("")}
                />
                <Button
                  type="button"
                  disabled={!outputString}
                  title="Click to proceed"
                  icon={"pi pi-copy"}
                  label={"Copy"}
                  className="h-full px-5 text-base xs:text-lg text-color1 bg-color4 font-content rounded-full"
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
