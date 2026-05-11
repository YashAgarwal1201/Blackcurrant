import { useState } from "react";
import Layout from "../../Layout/Layout";
import { DATE_OPTIONS, dateFunctions } from "../../Services/Data/Constants";
import { Button } from "primereact/button";
import SwiperContainer from "../../Components/SwiperContainer/SwiperContainer";
import useDateFunctionsStore from "../../Services/Stores/dateFunctionsStore";
import { useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import {
  getCurrentDate,
  isWeekend,
  isLeapYear,
  calculateAge,
  getFirstDayOfMonth,
  getLastDayOfMonth,
  convertTimestampToDate,
  getDaysBetweenDates,
  addDaysToDate,
} from "../../Services/DateFunctions";

const PlayWithDatesPage = () => {
  const { selectedDateFunction, setSelectedDateFunction } =
    useDateFunctionsStore();
  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: { inputDate: "", secondDate: "" },
    mode: "onChange",
  });

  const [outputString, setOutputString] = useState(
    selectedDateFunction === "Current Date"
      ? dateFunctions[selectedDateFunction]
      : "",
  );

  const inputDate = watch("inputDate");
  const secondDate = watch("secondDate");

  console.log(secondDate);

  const handleDateFunction = (inputString, secondString) => {
    const parsedDate = new Date(inputString);
    const parsedSecondDate = secondString ? new Date(secondString) : null;

    switch (selectedDateFunction) {
      case "Current Date":
        return getCurrentDate();
      case "Is Weekend":
        return isWeekend(parsedDate)
          ? "Yes, it's a weekend"
          : "No, it's a weekday";
      case "Is Leap Year":
        return isLeapYear(parsedDate.getFullYear())
          ? "Yes, leap year"
          : "No, not a leap year";
      case "Calculate Age":
        return `Age: ${calculateAge(parsedDate)} years`;
      case "First Day of Month":
        return getFirstDayOfMonth(parsedDate).toLocaleDateString();
      case "Last Day of Month":
        return getLastDayOfMonth(parsedDate).toLocaleDateString();
      case "Convert Timestamp":
        return convertTimestampToDate(Number(inputString));
      case "Days Between Dates":
        return parsedSecondDate
          ? `${getDaysBetweenDates(parsedDate, parsedSecondDate)} days`
          : "Please enter both dates.";
      case "Add Days to Date":
        return addDaysToDate(parsedDate, 10).toLocaleDateString();
      default:
        return "";
    }
  };

  const onSubmit = (data) => {
    const result = handleDateFunction(data.inputDate, data.secondDate);
    setOutputString(result);
  };

  const isSecondDateRequired = selectedDateFunction === "Days Between Dates";

  return (
    <Layout>
      <div className="custom-scrollbar w-full h-full p-2 md:p-3 lg:p-4 flex flex-col gap-y-4 sm:pa-y-6 md:gap-y-10 overflow-y-auto">
        <h1 className="text-2xl xs:text-3xl mdl:text-4xl text-color5 font-heading select-none">
          Play with JS Dates
        </h1>

        <SwiperContainer>
          {DATE_OPTIONS?.map((value, key) => (
            <Button
              type="button"
              title={`Click to convert input string to '${value}'`}
              key={key}
              label={value}
              className={`swiper-slide !w-auto mr-2 h-8 md:h-9 lg:h-10 px-5 text-xs sm:text-sm md:text-base lg:text-lg shrink-0 font-content rounded-full border md:border-2 ${
                selectedDateFunction === value
                  ? "bg-color4 text-color1 border-color4 pointer-events-none"
                  : "bg-transparent text-color4 border-color4 pointer-events-auto"
              }`}
              onClick={() => setSelectedDateFunction(value)}
            />
          ))}
        </SwiperContainer>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 xl:gap-8">
          <div>
            <form
              className="flex flex-col gap-y-3 md:gap-y-5 mdl:gap-y-10"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="flex flex-col gap-y-3">
                <label className="text-lg xs:text-xl text-color4 font-subHeading select-none">
                  Input Date
                </label>
                <InputText
                  placeholder="Enter date as YYYY-MM-DD, MM/DD/YYYY, or timestamp"
                  className="custom-scrollbar p-4 text-base xs:text-lg mdl:text-xl text-color5 font-content border-2 border-color3 bg-color2 rounded-xl mdl:rounded-2xl resize-none"
                  maxLength={75}
                  {...register("inputDate", { required: true })}
                  disabled={selectedDateFunction === "Current Date"}
                />
                {isSecondDateRequired && (
                  <InputText
                    placeholder="Enter second date as YYYY-MM-DD or MM/DD/YYYY"
                    className="custom-scrollbar p-4 text-base xs:text-lg mdl:text-xl text-color5 font-content border-2 border-color3 bg-color2 rounded-xl mdl:rounded-2xl resize-none mt-3"
                    maxLength={75}
                    {...register("secondDate", {
                      required: isSecondDateRequired,
                    })}
                  />
                )}
              </div>

              <div className="h-9 md:h-10 lg:h-11 flex items-center gap-x-3">
                <Button
                  type="button"
                  disabled={!inputDate}
                  title="Click to remove everything"
                  icon={"pi pi-trash"}
                  label={"Discard"}
                  className="h-full px-5 text-sm md:text-base lg:text-lg text-color4 bg-transparent font-content border sm:border-2 border-color4 rounded-full"
                  onClick={() => reset()}
                />
                <Button
                  type="submit"
                  disabled={!inputDate}
                  title="Click to proceed"
                  icon={"pi pi-check"}
                  label={"Continue"}
                  className="h-full px-5 text-sm md:text-base lg:text-lg text-color1 bg-color4 font-content rounded-full"
                />
              </div>
            </form>
          </div>

          <div>
            <form className="flex flex-col gap-y-3 md:gap-y-5 mdl:gap-y-10">
              <div className="flex flex-col gap-y-3">
                <label className="text-lg xs:text-xl text-color4 font-subHeading select-none">
                  Output String
                </label>
                <InputText
                  value={outputString?.toString()}
                  className="p-4 text-base xs:text-lg mdl:text-xl text-color5 font-content border-2 border-color3 bg-color2 rounded-xl mdl:rounded-2xl resize-none"
                  readOnly
                />
              </div>

              <div className="h-9 md:h-10 lg:h-11 flex flex-row sm:flex-row-reverse items-center gap-x-3">
                <Button
                  type="button"
                  disabled={!outputString}
                  title="Click to remove everything"
                  icon={"pi pi-trash"}
                  label={"Discard"}
                  className="h-full px-5 text-sm md:text-base lg:text-lg text-color4 bg-transparent font-content border sm:border-2 border-color4 rounded-full"
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

export default PlayWithDatesPage;
