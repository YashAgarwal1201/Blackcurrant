import React from "react";
import "./ImageFramesPage.scss";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useAppContext } from "../../Services/AppContext";

type ImageFramesPageProps = {
  showDialog: boolean;
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
};

const ImageFramesPage = ({
  showDialog,
  setShowDialog,
}: ImageFramesPageProps) => {
  const { state } = useAppContext();

  return (
    <Dialog
      visible={showDialog}
      onHide={() => setShowDialog(false)}
      className="min-w-[100dvw] min-h-[100dvh] absolute top-0 left-0 right-0 bottom-0 m-auto bg-color2"
      position="top"
      draggable={false}
      dismissableMask={true}
      header={
        <h1 className="capitalize">
          {state.menuOption ? state.menuOption : ""}
        </h1>
      }
      headerClassName=" bg-color2 rounded-none"
      contentClassName="px-3 sm:px-6 bg-color3 -shadow-lg rounded-none"
      modal={false}
    >
      <div className="h-full">
        <nav className="h-[60px] flex justify-start items-center gap-x-2 overflow-x-auto">
          <Button label='fsdfs' className="px-3 sm:px-5 py-2 bg-color1 text-color3 rounded-full" />
        </nav>
        <div className="w-full h-[calc(100%-60px)] border-2">
          <iframe className="w-full h-full border-2 border-black" loading="lazy"></iframe>
        </div>
      </div>
    </Dialog>
  );
};

export default ImageFramesPage;
