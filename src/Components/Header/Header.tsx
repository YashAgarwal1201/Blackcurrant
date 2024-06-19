// import { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Image } from "primereact/image";
import { useAppContext } from "../../Services/AppContext";
import { TOAST_MSGS } from "../../Services/Constants";

const Header = () => {
  const {
    // setShowSettings,
    showToast,
  } = useAppContext();

  const { FEAT_UNDER_CONSTRUCTION } = TOAST_MSGS;

  return (
    <div className="header-card w-full md:w-[64px] h-[56px] md:h-full px-3 md:px-1 py-1 md:py-3 flex flex-row md:flex-col justify-between items-center bg-color5 font-content text-base xs:text-lg md:text-xl lg:text-2xl shadow-lg select-none">
      {/* Display the time and date on the left side */}
      <Image src="/logo.svg" className="w-auto md:w-full h-full md:h-auto aspect-square" />

      <div className="flex items-center text-color1">
        <Button
          icon={<span className="material-symbols-rounded">settings</span>}
          // onClick={() => showToast("info", "Info", FEAT_UNDER_CONSTRUCTION)}
          onClick={() => {
            showToast("info", "Info", FEAT_UNDER_CONSTRUCTION);
            // setShowSettings(true);
          }}
          className="p-0"
          rounded
        />
      </div>
    </div>
  );
};

export default Header;
