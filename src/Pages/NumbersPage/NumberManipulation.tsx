import { Button } from "primereact/button";
import Layout from "../../Layout/Layout";
import { NUMBER_OPTIONS, numberFunctions } from "../../Services/Constants";
import useNumberFunctionsStore from "../../Services/Stores/numberFunctionsStore";
import { useState } from "react";
import SingleInput from "../../Components/NumberFunctions/SingleInput/SingleInput";
import DoubleInput from "../../Components/NumberFunctions/DoubleInput/DoubleInput";
import SwiperContainer from "../../Components/SwiperContainer/SwiperContainer";

const NumberManipulation = () => {
  const { selectedNumberFunction, setSelectedNumberFunction } =
    useNumberFunctionsStore();

  return (
    <Layout>
      <div className="custom-scrollbar w-full h-full p-2 md:p-3 lg:p-4 flex flex-col gap-y-4 sm:pa-y-6 md:gap-y-10 overflow-y-auto">
        <h1 className="text-2xl xs:text-3xl mdl:text-4xl text-color5 font-heading select-none">
          Number Manipulation
        </h1>

        {/* <div className="flex flex-nowrap justify-start items-center gap-x-2 md:gap-x-3 overflow-x-auto scrollbar-hide">
          {NUMBER_OPTIONS?.map((value, key) => (
            <Button
              type="button"
              title={`Click to convert input string to '${value}'`}
              key={key}
              label={value}
              // className="h-full px-5 flex-grow flex-shrink-0 text-xs sm:text-sm md:text-base lg:text-lg text-color4 font-content bg-transparent rounded-full border md:border-2 border-color4"
              className={`h-8 md:h-9 lg:h-10 px-5 flex-shrink-0 text-xs sm:text-sm md:text-base lg:text-lg font-content rounded-full border md:border-2 ${
                selectedNumberFunction === value
                  ? "bg-color4 text-color1 border-color4 pointer-events-none"
                  : "bg-transparent text-color4 border-color4 pointer-events-auto"
              }`}
              onClick={() => setSelectedNumberFunction(value)}
            />
          ))}
        </div> */}

        <SwiperContainer>
          {NUMBER_OPTIONS?.map((value, key) => (
            <Button
              type="button"
              title={`Click to convert input string to '${value}'`}
              key={key}
              label={value}
              // className="h-full px-5 flex-grow flex-shrink-0 text-xs sm:text-sm md:text-base lg:text-lg text-color4 font-content bg-transparent rounded-full border md:border-2 border-color4"
              className={`swiper-slide !w-auto mr-2 h-8 md:h-9 lg:h-10 px-5 text-xs sm:text-sm md:text-base lg:text-lg flex-shrink-0 font-content rounded-full border md:border-2 ${
                selectedNumberFunction === value
                  ? "bg-color4 text-color1 border-color4 pointer-events-none"
                  : "bg-transparent text-color4 border-color4 pointer-events-auto"
              }`}
              onClick={() => setSelectedNumberFunction(value)}
            />
          ))}
        </SwiperContainer>

        {selectedNumberFunction !== "Greatest Common Divisor" &&
        selectedNumberFunction !== "Least Common Multiple" ? (
          <SingleInput />
        ) : (
          <DoubleInput />
        )}
      </div>
    </Layout>
  );
};

export default NumberManipulation;
