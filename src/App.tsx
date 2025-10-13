import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Toast } from "primereact/toast";
import "./App.scss";
import useToastStore from "./Services/Stores/toastMessageStore";

const DocumentTitleUpdater = () => {
  const location = useLocation();

  useEffect(() => {
    const titleMap: { [key: string]: string } = {
      "/": "Project Blackcurrant",
      "/home": "Project Blackcurrant | Home",
      "/play-with-strings": "Project Blackcurrant | Play with Strings",
      "/play-with-numbers": "Project Blackcurrant | Play with Numbers",
      "/play-with-dates": "Project Blackcurrant | Play with JS Dates",
      "/web-apis": "Project Blackcurrant | Web APIs",
      "/coditor-playground": "Project Blackcurrant | Coditor Playground",
    };

    document.title =
      titleMap[location.pathname] || "Project Blackcurrant | Page Not found"; // Default title if route doesn't match
  }, [location]);

  return null; // This component only updates the title
};

function App() {
  const toastRef = useRef<Toast | null>(null);
  const setToastRef = useToastStore((state) => state.setToastRef);

  useEffect(() => {
    setToastRef(toastRef);
  }, [setToastRef]);

  // useEffect(() => {
  //   sessionStorage.setItem(`bananaAppData`, JSON.stringify(state));
  // }, [state]);

  return (
    <div className="w-screen h-[100dvh] bg-color1">
      <DocumentTitleUpdater />
      <Toast ref={toastRef} />
      <Outlet />
    </div>
  );
}

export default App;
