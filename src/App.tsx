import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Toast } from "primereact/toast";
import { useAppContext } from "./Services/AppContext";
import "./App.scss";

const DocumentTitleUpdater = () => {
  const location = useLocation();

  useEffect(() => {
    const titleMap: { [key: string]: string } = {
      "/": "Project Blackcurrant",
      "/home": "Project Blackcurrant | Home",
      "/string-manipulation": "Project Blackcurrant | String Manipulation",
    };

    document.title =
      titleMap[location.pathname] || "Project Blackcurrant | Page Not found"; // Default title if route doesn't match
  }, [location]);

  return null; // This component only updates the title
};

function App() {
  const { dispatch, state } = useAppContext();
  const myToast = useRef<Toast>(null);

  useEffect(() => {
    dispatch?.({
      type: "SET_TOAST_REF",
      payload: myToast.current as Toast,
    });
  }, []);

  useEffect(() => {
    sessionStorage.setItem(`bananaAppData`, JSON.stringify(state));
  }, [state]);

  return (
    <div className="w-screen h-[100dvh] bg-color3">
      <DocumentTitleUpdater />
      <Toast ref={myToast} />
      <Outlet />
    </div>
  );
}

export default App;
