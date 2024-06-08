import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
import { formatDate } from "../../Services/CommonFunctions";
import { Button } from "primereact/button";
import { useAppContext } from "../../Services/AppContext";
import { TOAST_MSGS } from "../../Services/Constants";

const Header = () => {
  const {
    // setShowSettings,
    showToast,
  } = useAppContext();

  const { FEAT_UNDER_CONSTRUCTION } = TOAST_MSGS;

  const [dateTime, setDateTime] = useState(new Date());
  const [batteryLevel, setBatteryLevel] = useState<any>(null);
  const [isCharging, setIsCharging] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date()); // Update the date and time every second
    }, 1000);

    return () => clearInterval(timer); // Clear the timer when the component unmounts
  }, []);

  useEffect(() => {
    const fetchBattery = async () => {
      if ("getBattery" in navigator)
        if (typeof navigator.getBattery === "function") {
          const battery = await navigator.getBattery();
          setBatteryLevel((battery.level * 100)?.toFixed(0));
          setIsCharging(battery.charging);
          battery.addEventListener("levelchange", () => {
            setBatteryLevel((battery.level * 100)?.toFixed(0));
          });
          battery.addEventListener("chargingchange", () => {
            setIsCharging(battery.charging);
          });
        } else {
          // Handle case where getBattery is not supported
          console.warn("navigator.getBattery is not supported");
        }
    };

    fetchBattery();
  }, []);

  return (
    <div className="header-card h-[32px] md:h-[40px] lg:h-[48px] px-3 lg:px-7 flex justify-between items-center bg-color1 font-content text-xs xs:text-sm md:text-base shadow-lg">
      {/* Display the time and date on the left side */}
      <div className="text-color3">{formatDate(dateTime)}</div>

      {/* Navigation link to home */}
      {/* <Link
        to="/home"
        className="hidden xs:block text-color3 text-lg xs:text-2xl md:text-3xl xl:text-4xl font-heading capitalize"
      >
        <span>Banana</span>
      </Link> */}

      <div className="flex items-center text-color3">
        {batteryLevel ? <span>{batteryLevel}%</span> : ""}
        {!isCharging ? (
          <span className="material-symbols-rounded">battery_full</span>
        ) : (
          <span className="material-symbols-rounded">
            battery_charging_full
          </span>
        )}
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
