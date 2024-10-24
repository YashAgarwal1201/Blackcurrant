import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { numberFunctions } from "../../../Services/Constants";
import useNumberFunctionsStore from "../../../Services/Stores/numberFunctionsStore";
import { InputText } from "primereact/inputtext";

const SingleInput = () => {
  const {
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
    setValue,
  } = useForm({ defaultValues: { inputVal1: 0 }, mode: "onChange" });

  const [outputVal, setOutputVal] = useState<any>("");

  const inputVal1 = watch("inputVal1");

  const { selectedNumberFunction } = useNumberFunctionsStore();

  const onSubmit = (data: any) => {
    const input1 = data.inputVal1 || 0;
    // console.log(input1);
    const selectedFunction = numberFunctions[selectedNumberFunction];

    if (selectedFunction) {
      const processedString = selectedFunction(input1);
      // console.log(processedString);
      setOutputVal(processedString);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 xl:gap-8">
      <div className="">
        <form
          className="flex flex-col gap-y-3 md:gap-y-5 mdl:gap-y-10"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-y-3">
            <div className="flex items-center justify-between">
              <label className="text-lg xs:text-xl text-color4 font-subHeading select-none">
                Input Value 1
              </label>
              {errors.inputVal1 && (
                <p className="hidden md:block ml-auto text-sm xs:text-base xl:text-lg text-color2 font-content select-none">
                  {errors.inputVal1.message}
                </p>
              )}
            </div>
            <InputNumber
              className="custom-scrollbar p-4 text-base xs:text-lg mdl:text-xl text-color5 font-content border-2 border-color3 bg-color2 *:bg-color2 rounded-xl mdl:rounded-2xl"
              maxLength={16}
              // {...register("inputVal1", { required: true })}
              value={inputVal1 ?? undefined} // PrimeReact requires undefined, not null
              onValueChange={(e) => setValue("inputVal1", e.value ?? 0)} // Handle value change correctly
              format={false}
              required={true}
            />
            {errors.inputVal1 && (
              <p className="hidden md:block ml-auto text-sm xs:text-base xl:text-lg text-color2 font-content select-none">
                {errors.inputVal1.message}
              </p>
            )}
          </div>

          <div className="h-9 md:h-10 lg:h-11 flex items-center gap-x-3">
            <Button
              type="button"
              disabled={!inputVal1}
              title="Click to remove everything"
              icon={"pi pi-trash"}
              label={"Discard"}
              className="h-full px-5 text-sm md:text-base lg:text-lg text-color4 bg-transparent font-content border-1 sm:border-2 border-color4 rounded-full"
              onClick={() => reset()}
            />
            <Button
              type="submit"
              disabled={
                !inputVal1 || !isValid //|| errors.inputVal2
              }
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
                Output
              </label>
            </div>
            <InputText
              value={outputVal}
              className=" p-4 text-base xs:text-lg mdl:text-xl text-color5 font-content border-2 border-color3 bg-color2 *:bg-color2 rounded-xl mdl:rounded-2xl resize-none"
              readOnly
            />
          </div>
          <div className="h-9 md:h-10 lg:h-11 flex flex-row sm:flex-row-reverse items-center gap-x-3">
            <Button
              type="button"
              disabled={!outputVal}
              title="Click to remove everything"
              icon={"pi pi-trash"}
              label={"Discard"}
              className="h-full px-5 text-sm md:text-base lg:text-lg text-color4 bg-transparent font-content border-1 sm:border-2 border-color4 rounded-full"
              onClick={() => setOutputVal(0)}
            />
            <Button
              type="button"
              disabled={!outputVal}
              title="Click to proceed"
              icon={"pi pi-copy"}
              label={"Copy"}
              className="h-full px-5 text-sm md:text-base lg:text-lg text-color1 bg-color4 font-content rounded-full"
              onClick={() =>
                navigator.clipboard.writeText(
                  outputVal?.toString() ? outputVal.toString() : ""
                )
              }
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default SingleInput;
