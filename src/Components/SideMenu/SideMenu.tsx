import { Sidebar } from "primereact/sidebar";
import { Panel } from "primereact/panel";
import { Button } from "primereact/button";
// import { Divider } from "primereact/divider";
import "./SideMenu.scss";

const SideMenu = ({ showSideMenu, setShowSideMenu }) => {
  return (
    <Sidebar
      visible={showSideMenu}
      onHide={() => setShowSideMenu(false)}
      position="right"
      header={
        <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl text-color5">
          Settings
        </h2>
      }
      className="side-menu w-full md:w-1/3 max-w-[768px] bg-color1 rounded-none md:rounded-l-2xl"
      closeIcon={<span className="pi pi-times text-color5"></span>}
      maskClassName="backdrop-blur"
    >
      <div className="w-full bg-color4 rounded-3xl py-4 px-4">
        <Panel
          headerTemplate={(options) => {
            const togglePanel = (event: React.MouseEvent<HTMLElement>) => {
              options.onTogglerClick!(event); // Trigger expand/collapse behavior
            };

            return (
              <div
                className="cursor-pointer custom-panel-header w-full flex justify-between items-center px-2 py-4 rounded-xl"
                onClick={togglePanel}
              >
                <h3 className="font-subHeading font-medium text-color1 flex items-center">
                  <span className="pi pi-palette mr-4"></span>
                  Change Theme
                </h3>
                {/* <span
                  className={`pi ${
                    options.collapsed ? "pi-chevron-down" : "pi-chevron-up"
                  }`}
                ></span> */}
              </div>
            );
          }}
          className="bg-transparent rounded-2xl"
          collapsed
          toggleable
          // expandIcon={<span className="pi pi-chevron-down text-color2"></span>}
          // collapseIcon={<span className="pi pi-chevron-up text-color2"></span>}
        >
          <div>
            <span>Coming Soon!</span>
          </div>
        </Panel>

        <div className="mx-2 my-1 p-0 max-w-full h-[1.5px] bg-color2" />

        <Button className="w-full py-4 px-2 bg-color4 font-subHeading text-color1 rounded-xl">
          <h3 className="font-subHeading font-medium text-color1 flex items-center">
            <span className="pi pi-comment mr-4"></span>
            Feedback
          </h3>
        </Button>

        <div className="mx-2 my-1 p-0 max-w-full h-[1.5px] bg-color2" />

        <a
          href="https://yashagarwal1201.github.io/"
          target="_blank"
          rel="noopener"
          className="!w-full block py-4 px-2 bg-color4 font-subHeading text-color1 rounded-xl not-italic"
        >
          <h3 className="font-subHeading font-medium text-color1 flex items-center">
            <span className="pi pi-github mr-4"></span>
            Developer Profile
          </h3>
        </a>
      </div>
    </Sidebar>
  );
};

export default SideMenu;
