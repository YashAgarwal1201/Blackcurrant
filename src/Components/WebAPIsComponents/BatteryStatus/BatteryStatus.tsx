import { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { WEB_APIS_CARDS_BASE_STYLES } from "../../../Services/Constants";

const BatteryStatus = () => {
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState<boolean | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(true);

  useEffect(() => {
    if (!("getBattery" in navigator)) {
      setIsSupported(false);
      return;
    }

    let battery: any = null;

    const updateBatteryStatus = () => {
      const level = battery?.level;
      if (battery && typeof level === "number" && !isNaN(level)) {
        setBatteryLevel(Math.floor(level * 100));
        setIsCharging(battery.charging);
      } else {
        setIsSupported(false);
      }
    };

    (navigator as any)
      .getBattery()
      .then((bat: any) => {
        battery = bat;
        updateBatteryStatus();
        battery.addEventListener("levelchange", updateBatteryStatus);
        battery.addEventListener("chargingchange", updateBatteryStatus);
      })
      .catch(() => setIsSupported(false));

    // Cleanup has access to battery via closure — this actually runs
    return () => {
      if (battery) {
        battery.removeEventListener("levelchange", updateBatteryStatus);
        battery.removeEventListener("chargingchange", updateBatteryStatus);
      }
    };
  }, []);

  return (
    <Card
      className={WEB_APIS_CARDS_BASE_STYLES}
      title={<h2 className="font-heading">Battery Status</h2>}
      subTitle={
        <p className="font-subHeading">
          (may not be supported in all browsers)
        </p>
      }
    >
      {!isSupported ? (
        <p>Battery Status API is not supported in this browser.</p>
      ) : batteryLevel === null ? (
        <p>Checking battery status...</p>
      ) : (
        <div>
          <p>Battery Level: {batteryLevel}%</p>
          <p>Status: {isCharging ? "Charging" : "Not Charging"}</p>
        </div>
      )}
    </Card>
  );
};

export default BatteryStatus;
