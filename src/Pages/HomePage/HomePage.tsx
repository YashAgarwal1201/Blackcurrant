import { useRef } from "react";
import Layout from "../../Layout/Layout";
import { useAppContext } from "../../Services/AppContext";
import "./HomePage.scss";
import { ContextMenu } from "primereact/contextmenu";
// import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  // const navigate = useNavigate();
  const { showToast } = useAppContext();

  const cm = useRef<ContextMenu>(null);
  const items = [
    {
      label: "Reload Project",
      icon: <span className="pi pi-refresh"></span>,
      command: () => window?.location?.reload(),
    },
    {
      label: "Change Wallpaper",
      icon: <span className="material-symbols-rounded">wallpaper</span>,
      command: () =>
        showToast("info", "Info", "This feature is under construction."),
    },
  ];

  return (
    <Layout>
      <ContextMenu model={items} ref={cm} />
      <div
        className="h-full flex justify-center items-center"
        onContextMenu={(e: any) => cm.current?.show(e)}
      >
        <h1>Project Blackcurrant</h1>
      </div>
    </Layout>
  );
};

export default LandingPage;
