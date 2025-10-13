import { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { WEB_APIS_CARDS_BASE_STYLES } from "../../../Services/Constants";

const BatteryStatus = () => {
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState<boolean | null>(null);

  useEffect(() => {
    const getBatteryStatus = async () => {
      if ("getBattery" in navigator) {
        const battery = await (navigator as any).getBattery();

        const updateBatteryStatus = () => {
          setBatteryLevel(Math.floor(battery.level * 100));
          setIsCharging(battery.charging);
        };

        updateBatteryStatus();

        battery.addEventListener("levelchange", updateBatteryStatus);
        battery.addEventListener("chargingchange", updateBatteryStatus);

        return () => {
          battery.removeEventListener("levelchange", updateBatteryStatus);
          battery.removeEventListener("chargingchange", updateBatteryStatus);
        };
      } else {
        setBatteryLevel(null);
        setIsCharging(null);
      }
    };

    getBatteryStatus();
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
      {batteryLevel !== null ? (
        <div>
          <p>
            Battery Level: {batteryLevel}% (
            {isCharging ? "Charging" : "Not Charging"})
          </p>
        </div>
      ) : (
        <p>Battery status not supported on this browser.</p>
      )}
    </Card>
  );
};

export default BatteryStatus;
