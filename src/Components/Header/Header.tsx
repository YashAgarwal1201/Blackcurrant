// import { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { useAppContext } from "../../Services/AppContext";
import { TOAST_MSGS } from "../../Services/Constants";

const Header = () => {
  const {
    // setShowSettings,
    showToast,
  } = useAppContext();

  const { FEAT_UNDER_CONSTRUCTION } = TOAST_MSGS;

  return (
    <div className="header-card h-[40px] md:h-[56px] lg:h-[64px] px-3 lg:px-7 flex justify-between items-center bg-color1 font-content text-base xs:text-lg md:text-xl lg:text-2xl shadow-lg select-none">
      {/* Display the time and date on the left side */}
      <h1 className="text-color3 font-heading">Blackcurrant</h1>

      <div className="flex items-center text-color3">
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
