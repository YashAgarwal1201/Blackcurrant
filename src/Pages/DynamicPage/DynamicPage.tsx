import { startTransition, useRef } from "react";
import Layout from "../../Layout/Layout";
import { Button } from "primereact/button";
import { openInNewTab } from "../../Services/CommonFunctions";
import { useAppContext } from "../../Services/AppContext";
import { TOAST_MSGS } from "../../Services/Constants";
import { useNavigate } from "react-router-dom";

const DynamicPage = ({ data }: { data: any }) => {
  const navigate = useNavigate();
  const { dispatch, showToast } = useAppContext();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const { FEAT_UNDER_CONSTRUCTION, LINK_IN_NEW_TAB } = TOAST_MSGS;

  const titleBarBtnsStyles = "h-full text-color4";

  const handleFullscreen = () => {
    if (iframeRef.current) {
      const iframe = iframeRef.current as HTMLIFrameElement & {
        mozRequestFullScreen?: () => Promise<void>;
        webkitRequestFullscreen?: () => Promise<void>;
        msRequestFullscreen?: () => Promise<void>;
      };

      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      } else if (iframe.mozRequestFullScreen) {
        // Firefox
        iframe.mozRequestFullScreen();
      } else if (iframe.webkitRequestFullscreen) {
        // Chrome, Safari and Opera
        iframe.webkitRequestFullscreen();
      } else if (iframe.msRequestFullscreen) {
        // IE/Edge
        iframe.msRequestFullscreen();
      }
    }
  };

  const handleClose = () => {
    dispatch({
      type: "REMOVE_OPENED_APP",
      payload: data.name,
    });
    showToast("info", "Info", "App closed");
    startTransition(() => navigate("/home"));
  };

  // Check if the app is still opened
  // if (!state.openedApps.includes(data.name)) {
  //   // return null;

  // }

  return (
    <Layout>
      <div className="h-full flex justify-center items-center">
        <div className="w-full h-full bg-color2 border-2 border-color2 rounded-lg shadow-md">
          <div className="w-full h-7 xs:h-8 md:h-9 lg:h-10 flex justify-between items-center bg-color2">
            {data.url ? (
              <Button
                title="Open app in new tab"
                icon="pi pi-external-link"
                className={titleBarBtnsStyles}
                onClick={() => {
                  openInNewTab(data.url);
                  showToast("info", "Info", LINK_IN_NEW_TAB);
                }}
              />
            ) : (
              <div></div>
            )}

            <div className="h-full">
              <Button
                title="Minimise app"
                icon="pi pi-minus"
                className={titleBarBtnsStyles}
                onClick={() =>
                  showToast("info", "Info", FEAT_UNDER_CONSTRUCTION)
                }
              />
              <Button
                title="Full screen view"
                icon="pi pi-window-maximize"
                className={titleBarBtnsStyles}
                onClick={handleFullscreen}
              />
              <Button
                title="Click to close this app"
                icon="pi pi-times"
                className={titleBarBtnsStyles}
                onClick={() =>
                  handleClose()
                }
              />
            </div>
          </div>

          {data.url ? (
            <iframe
              ref={iframeRef}
              src={data.url}
              className="w-full h-[calc(100%-1.75rem)] xs:h-[calc(100%-2rem)] md:h-[calc(100%-2.25rem)] lg:h-[calc(100%-2.5rem)] bg-white border-none rounded-t-md rounded-b-lg outline-none"
            />
          ) : (
            ""
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DynamicPage;
