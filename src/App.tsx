import { useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import { Toast } from "primereact/toast";
import { useAppContext } from "./Services/AppContext";
import "./App.scss";
// import ErrorBoundary from "./Services/ErrorBoundary";

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
    // <ErrorBoundary>
    <div className="w-screen h-[100dvh] bg-color3">
      <Toast ref={myToast} />
      <Outlet />
    </div>
    // </ErrorBoundary>
  );
}

export default App;
