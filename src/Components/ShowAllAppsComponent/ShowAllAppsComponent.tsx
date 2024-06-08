import { startTransition } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog } from "primereact/dialog";
// import { DOCK_OPTIONS_LIST } from "../../Services/Constants";
import { Button } from "primereact/button";
import { useAppContext } from "../../Services/AppContext";

const ShowAllAppsComponent = () => {
  const navigate = useNavigate();
  const { state, dispatch, setShowAllApps } = useAppContext();
  const menuBtnsStyles =
    "p-2 lg:p-3 aspect-square flex flex-col justify-center items-center gap-y-2 font-content text-xs xs:text-sm sm:text-base";

  // const handleAppClick = (appName: string, appUrl: string) => {
  //   startTransition(() => {
  //     navigate(`/${appName.replace(/\s+/g, "-").toLowerCase()}`, {
  //       replace: true,
  //     });
  //   });
  //   setShowAllApps(!showAllApps);

  // };

  return (
    <Dialog
      visible={state.showAllApps}
      onHide={() => setShowAllApps(false)}
      draggable={false}
      resizable={false}
      position="bottom"
      className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 h-full"
      dismissableMask={true}
      headerClassName="bg-color2 text-color1"
      header={<h1 className="font-heading">All Apps</h1>}
      contentClassName="bg-color2 text-color4"
    >
      <div className=" grid grid-flow-row grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        <Button
          title={"go home"}
          icon={
            <img
              src={"/logo.svg"}
              className="w-1/2 h-1/2 bg-color1 rounded-md"
            />
          }
          className={menuBtnsStyles}
          onClick={() => {
            startTransition(() =>
              navigate(`/home`, {
                replace: true,
              })
            );
            setShowAllApps(!state.showAllApps);
          }}
        >
          <span>Home</span>
        </Button>
        {/* {DOCK_OPTIONS_LIST?.map((values, key) => (
          <Button
            key={key}
            title={values.name}
            icon={
              <img
                src={`${values.url}/logo.svg`}
                className="w-1/2 h-1/2 bg-color1 rounded-md"
              />
            }
            className={menuBtnsStyles}
            onClick={() => {
              startTransition(() =>
                navigate(
                  `/${values?.name?.replace(/\s+/g, "-")?.toLowerCase()}`,
                  {
                    replace: true,
                  }
                )
              );
              // showToast("info", "Info", "This feature is under construction");
              setShowAllApps(!state.showAllApps);

              dispatch({
                type: "SET_OPENED_APPS",
                payload: values.name,
              });
            }}
          >
            <span>{values?.name}</span>
          </Button>
        ))} */}
      </div>
    </Dialog>
  );
};

export default ShowAllAppsComponent;
