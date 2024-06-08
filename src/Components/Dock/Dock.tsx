import { useState, startTransition } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog"; // import Dialog for popup
// import { DOCK_OPTIONS_LIST } from "../../Services/Constants";
import { useAppContext } from "../../Services/AppContext";
import { useNavigate } from "react-router-dom";

const DockComponent = () => {
  const navigate = useNavigate();
  const { state, setShowAllApps } = useAppContext();
  const [showPopup, setShowPopup] = useState(false); // state for controlling popup visibility

  // Filter the opened apps from DOCK_OPTIONS_LIST
  // const openedApps = DOCK_OPTIONS_LIST.filter((value) =>
  //   state.openedApps?.includes(value?.name)
  // );

  // Determine whether it's a mobile device
  const isMobile = window.innerWidth < 768;

  // Get the apps to display in the dock (max 3 for mobile)
  // const appsToShow = isMobile ? openedApps.slice(0, 3) : openedApps;
  // const additionalApps = isMobile ? openedApps.slice(3) : [];

  return (
    <div className="w-full h-[48px] xs:h-[60px] md:h-[72px] flex justify-center items-center">
      <div className="flex justify-center items-center gap-x-2 md:gap-x-3">
        <Button
          icon={<span className="material-symbols-rounded">apps</span>}
          onClick={() => setShowAllApps(true)}
          className="h-[calc(100%-0.5rem)] xs:h-full aspect-square rounded-md  bg-color1"
        />
        {/* {appsToShow.map((value, key) => (
          <Button
            key={key}
            icon={
              <img src={`${value.url}/logo.svg`} className="h-full w-full" />
            }
            title={value.name}
            onClick={() => {
              startTransition(() =>
                navigate(
                  `/${value?.name?.replace(/\s+/g, "-")?.toLowerCase()}`,
                  {
                    replace: true,
                  }
                )
              );
            }}
            className={`h-full aspect-square p-1 bg-color1 rounded-md flex justify-center items-center font-content`}
          />
        ))}
        {additionalApps.length > 0 && (
          <Button
            icon={<span className="material-symbols-rounded">more_horiz</span>}
            onClick={() => setShowPopup(true)}
            className="h-full aspect-square rounded-md  bg-color1"
          />
        )} */}
      </div>

      <Dialog
        header="Opened Apps"
        visible={showPopup}
        onHide={() => setShowPopup(false)}
        dismissableMask={true}
        position="bottom"
        className="w-full"
        showHeader={false}
        contentClassName="w-full p-2 rounded-md bg-color3"
      >
        <div className="flex flex-wrap gap-3">
          {/* {additionalApps.map((value, key) => (
            <Button
              key={key}
              icon={
                <img src={`${value.url}/logo.svg`} className="h-full w-full" />
              }
              title={value.name}
              onClick={() => {
                setShowPopup(false);
                startTransition(() =>
                  navigate(
                    `/${value?.name?.replace(/\s+/g, "-")?.toLowerCase()}`,
                    {
                      replace: true,
                    }
                  )
                );
              }}
              className="h-full aspect-square p-1 bg-color1 rounded-md flex justify-center items-center font-content"
            />
          ))} */}
        </div>
      </Dialog>
    </div>
  );
};

export default DockComponent;
