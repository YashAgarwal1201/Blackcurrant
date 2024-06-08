import { Dialog } from "primereact/dialog";
import { Accordion, AccordionTab } from "primereact/accordion";
// import React from "react";
import { useAppContext } from "../../Services/AppContext";

const SettingsDialog = () => {
  const { state, setShowSettings } = useAppContext();
  return (
    <Dialog
      visible={state.showSettings}
      onHide={() => setShowSettings(false)}
      dismissableMask={true}
      draggable={false}
      resizable={false}
      className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 h-full"
      header={<h1 className="font-heading">Settings</h1>}
      headerClassName="bg-color2 text-color1"
      contentClassName="bg-color2 text-color4"
    >
      <Accordion className="flex flex-col gap-y-2">
        <AccordionTab header={<h2 className="font-heading">Settings 1</h2>} headerClassName="bg-color4 text-color1 rounded-md">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Est adipisci
          eum praesentium veniam dolor? Temporibus blanditiis aliquam vitae qui
          autem, enim quod voluptates non, ratione beatae minima! Voluptas,
          nostrum a.
        </AccordionTab>

        <AccordionTab header={<h2 className="font-heading">Settings 2</h2>} headerClassName="bg-color4 text-color1 rounded-md">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Est adipisci
          eum praesentium veniam dolor? Temporibus blanditiis aliquam vitae qui
          autem, enim quod voluptates non, ratione beatae minima! Voluptas,
          nostrum a.
        </AccordionTab>
      </Accordion>
    </Dialog>
  );
};

export default SettingsDialog;
