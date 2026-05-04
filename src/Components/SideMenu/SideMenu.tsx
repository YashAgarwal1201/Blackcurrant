import { Sidebar } from "primereact/sidebar";
import { Panel } from "primereact/panel";
import { Button } from "primereact/button";
// import { Divider } from "primereact/divider";
import "./SideMenu.scss";
import {
  WhatsappShareButton,
  WhatsappIcon,
  LinkedinShareButton,
  LinkedinIcon,
  EmailIcon,
  EmailShareButton,
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
} from "react-share";
import useNavStore from "../../Services/Stores/navStore";

declare const __APP_VERSION__: string;

const TECH_STACK = [
  { label: "React 19", color: "#61DAFB" },
  { label: "TypeScript", color: "#3178C6" },
  { label: "Tailwind CSS v3", color: "#38BDF8" },
  { label: "PrimeReact", color: "#A78BFA" },
  { label: "Vite", color: "#FFD62E" },
  { label: "Zustand", color: "#FF6B35" },
];

const SideMenu = () => {
  const {
    isSideMenuOpen,
    isFeedbackDialogOpen,
    toggleSideMenu,
    openFeedbackDialog,
  } = useNavStore();
  const shareUrl = window.location.href;
  const shareText = "Check out this website!";

  return (
    <Sidebar
      visible={isSideMenuOpen && !isFeedbackDialogOpen}
      onHide={() => toggleSideMenu()}
      position="right"
      header={
        <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl text-color5">
          More Options
        </h2>
      }
      className="side-menu !w-full md:!w-[768px] rounded-none md:!rounded-l-xl bg-color1"
      closeIcon={<span className="pi pi-times text-color5"></span>}
      maskClassName="backdrop-blur"
      dismissable
    >
      <div className="w-full bg-color4 rounded-3xl py-4 px-4">
        <Panel
          headerTemplate={(options) => {
            const togglePanel = (event: React.MouseEvent<HTMLElement>) => {
              options.onTogglerClick!(event);
            };

            return (
              <div
                className="cursor-pointer custom-panel-header w-full flex justify-between items-center px-2 py-4 rounded-xl"
                onClick={togglePanel}
              >
                <h3 className="font-subHeading font-medium text-lg sm:text-xl text-color1 flex items-center">
                  <span className="pi pi-palette mr-4"></span>
                  Appearance
                </h3>
                <span
                  className={`pi ${
                    options.collapsed ? "pi-chevron-down" : "pi-chevron-up"
                  }`}
                ></span>
              </div>
            );
          }}
          className="bg-transparent rounded-2xl"
          collapsed
          toggleable
        >
          <div>
            <span>Coming Soon!</span>
          </div>
        </Panel>

        <div className="mx-2 my-1 p-0 max-w-full h-[1.5px] bg-color2" />

        <Button
          title="Give feedback"
          className="w-full py-4 px-2 bg-color4 font-subHeading text-lg sm:text-xl text-color1 rounded-xl"
          onClick={() => openFeedbackDialog()}
        >
          <h3 className="font-subHeading font-medium text-color1 flex items-center">
            <span className="pi pi-comment mr-4"></span>
            Feedback
          </h3>
        </Button>

        <div className="mx-2 my-1 p-0 max-w-full h-[1.5px] bg-color2" />

        <Panel
          headerTemplate={(options) => {
            const togglePanel = (event: React.MouseEvent<HTMLElement>) => {
              options.onTogglerClick!(event);
            };

            return (
              <div
                className="cursor-pointer custom-panel-header w-full flex justify-between items-center px-2 py-4 rounded-xl"
                onClick={togglePanel}
              >
                <h3 className="font-subHeading font-medium text-lg sm:text-xl text-color1 flex items-center">
                  <span className="pi pi-share-alt mr-4"></span>
                  Share
                </h3>
                <span
                  className={`pi ${
                    options.collapsed ? "pi-chevron-down" : "pi-chevron-up"
                  }`}
                ></span>
              </div>
            );
          }}
          className="bg-transparent rounded-2xl"
          collapsed
          toggleable
        >
          <div className="flex justify-center items-center gap-4">
            <WhatsappShareButton url={shareUrl} title={shareText}>
              <WhatsappIcon size={40} round />
            </WhatsappShareButton>

            <LinkedinShareButton url={shareUrl}>
              <LinkedinIcon size={40} round />
            </LinkedinShareButton>

            <RedditShareButton url={shareUrl} title={shareText}>
              <RedditIcon size={40} round />
            </RedditShareButton>

            <TelegramShareButton url={shareUrl} title={shareText}>
              <TelegramIcon size={40} round />
            </TelegramShareButton>

            <EmailShareButton
              url={shareUrl}
              subject="Check out this site"
              body={shareText}
            >
              <EmailIcon size={40} round />
            </EmailShareButton>
          </div>
        </Panel>

        <div className="mx-2 my-1 p-0 max-w-full h-[1.5px] bg-color2" />

        <a
          href={import.meta.env.VITE_DEVELOPER_PROFILE ?? ""}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="!w-full block py-4 px-2 bg-color4 font-subHeading text-lg sm:text-xl text-color1 rounded-xl not-italic"
        >
          <h3 className="font-subHeading font-medium text-color1 flex items-center">
            <span className="pi pi-github mr-4"></span>
            Developer Profile
          </h3>
        </a>

        <div className="mx-2 my-1 p-0 max-w-full h-[1.5px] bg-color2" />

        {/* About This App */}
        <Panel
          headerTemplate={(options) => {
            const togglePanel = (event: React.MouseEvent<HTMLElement>) => {
              options.onTogglerClick!(event);
            };

            return (
              <div
                className="cursor-pointer custom-panel-header w-full flex justify-between items-center px-2 py-4 rounded-xl"
                onClick={togglePanel}
              >
                <h3 className="font-subHeading font-medium text-lg sm:text-xl text-color1 flex items-center">
                  <span className="pi pi-info-circle mr-4"></span>
                  About This App
                </h3>
                <span
                  className={`pi ${
                    options.collapsed ? "pi-chevron-down" : "pi-chevron-up"
                  }`}
                ></span>
              </div>
            );
          }}
          className="bg-transparent rounded-2xl"
          collapsed
          toggleable
        >
          <div className="flex flex-col gap-4 px-2 pb-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-color1/60 font-content">
                Version
              </span>
              <span className="text-xs font-mono bg-color2/40 text-color1 px-3 py-1 rounded-full border border-color2">
                {__APP_VERSION__}
              </span>
            </div>

            <div className="h-px bg-color2" />

            <div className="flex flex-col gap-2">
              <span className="text-sm text-color1/60 font-content">
                Tools used
              </span>
              <div className="flex flex-wrap gap-2">
                {TECH_STACK.map(({ label, color }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 text-xs font-content text-color1 bg-color2/40 border border-color2 px-3 py-1 rounded-full"
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </Sidebar>
  );
};

export default SideMenu;
