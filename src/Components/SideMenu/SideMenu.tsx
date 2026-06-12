import { Sidebar } from "primereact/sidebar";
import { Panel, PanelHeaderTemplateOptions } from "primereact/panel";
import { Button } from "primereact/button";
// import { Divider } from "primereact/divider";

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
import { BASE_THEMES, ACCENT_COLORS } from "@/Services/Data/ThemesConstants";
import { Dropdown } from "primereact/dropdown";
import { Info, Monitor, Moon, Palette, Share2, Sun, X } from "lucide-react";
import "./SideMenu.scss";

declare const __APP_VERSION__: string;

const TECH_STACK = [
  { label: "React 19", color: "#61DAFB" },
  { label: "TypeScript", color: "#3178C6" },
  { label: "Tailwind CSS v4", color: "#38BDF8" },
  { label: "PrimeReact", color: "#A78BFA" },
  { label: "Vite", color: "#FFD62E" },
  { label: "Zustand", color: "#FF6B35" },
];

// Shared panel header - extracted to avoid 5x duplication ─────────────
const PanelHeader = ({
  options,
  icon,
  label,
  isOpen,
  children,
}: {
  options: PanelHeaderTemplateOptions;
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
  children?: React.ReactNode;
}) => (
  <div
    role="button"
    tabIndex={0}
    aria-expanded={isOpen}
    className="cursor-pointer custom-panel-header w-full flex justify-between items-center px-2 py-4 rounded-xl"
    onClick={(e) => options.onTogglerClick!(e)}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        options.onTogglerClick!(e as unknown as React.MouseEvent<HTMLElement>);
      }
    }}
  >
    <h3 className="font-subHeading font-medium text-lg sm:text-xl text-base-content flex items-center">
      <span
        className={`mr-4 text-primary transition-transform ${
          !options.collapsed ? "animate-icon-expand-nudge" : ""
        }`}
        aria-hidden="true"
      >
        {icon}
      </span>
      {label}
    </h3>
    {children}
    <span
      aria-hidden="true"
      className={`pi ${options.collapsed ? "pi-chevron-down" : "pi-chevron-up"} mr-1`}
    />
  </div>
);

const SideMenu = () => {
  const {
    isSideMenuOpen,
    isFeedbackDialogOpen,
    baseTheme,
    accentColor,
    toggleSideMenu,
    openFeedbackDialog,
    setBaseTheme,
    setAccentColor,
  } = useNavStore();
  const shareUrl = window.location.href;
  const shareText = "Check out this website!";

  return (
    <Sidebar
      visible={isSideMenuOpen && !isFeedbackDialogOpen}
      onHide={() => toggleSideMenu()}
      role="region"
      aria-label="Settings and options"
      dismissable
      draggable={false}
      header={
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-heading font-normal text-base-content">
          More Options
        </h2>
      }
      className="side-menu w-full md:w-[768px] rounded-l-none md:rounded-l-2xl bg-base-100 shadow-none"
      closeIcon={
        <X size={24} aria-hidden="true" className="text-base-content" />
      }
      maskClassName="backdrop-blur bg-transparent!"
      position="right"
    >
      <div className="w-full px-4 py-4 text-base-content bg-base-200 rounded-3xl overflow-y-auto">
        <Panel
          // headerTemplate={(options) => {
          //   const togglePanel = (event: React.MouseEvent<HTMLElement>) => {
          //     options.onTogglerClick!(event);
          //   };

          //   return (
          //     <div
          //       className="cursor-pointer custom-panel-header w-full flex justify-between items-center px-2 py-4 rounded-xl"
          //       onClick={togglePanel}
          //     >
          //       <h3 className="font-subHeading font-medium text-lg sm:text-xl text-color1 flex items-center">
          //         <span className="pi pi-palette mr-4"></span>
          //         Appearance
          //       </h3>
          //       <span
          //         className={`pi ${
          //           options.collapsed ? "pi-chevron-down" : "pi-chevron-up"
          //         }`}
          //       ></span>
          //     </div>
          //   );
          // }}

          headerTemplate={(options) => (
            <PanelHeader
              options={options}
              icon={<Palette size={20} />}
              label="Appearance"
              isOpen={false}
            >
              {/* Collapsed preview: theme icon + accent swatch */}
              {options.collapsed && (
                <div className="ml-auto mr-4 flex items-center gap-x-3">
                  <span aria-hidden="true">
                    {baseTheme === "system" ? (
                      <Monitor size={20} className="mr-3" />
                    ) : baseTheme === "light" ? (
                      <Sun size={16} className="mr-3" />
                    ) : (
                      <Moon size={16} className="mr-3" />
                    )}
                  </span>
                  <span
                    aria-hidden="true"
                    className="w-5 h-5 rounded-full ring-2 ring-offset-1 ring-base-content ring-offset-base-200"
                    style={{
                      backgroundColor: ACCENT_COLORS.find(
                        (ac) => ac.value === accentColor,
                      )?.swatch,
                    }}
                  />
                </div>
              )}
            </PanelHeader>
          )}
          className="bg-transparent rounded-2xl"
          collapsed
          toggleable
        >
          <div className="flex flex-col gap-y-5 px-1">
            <div className="flex flex-wrap justify-between items-center gap-3">
              <span className="font-content text-base-content">Theme</span>

              <Dropdown
                value={baseTheme}
                options={BASE_THEMES}
                onChange={(e) => setBaseTheme(e.value)}
                optionLabel="label"
                optionValue="value"
                placeholder="Select theme"
                className="min-w-[160px] h-10 *:py-2 *:px-3 rounded-xl! bg-primary *:text-primary-content *:font-content border-none"
                // panelClassName="mt-1 rounded-xl *:rounded-xl *:font-content"
                panelClassName="bg-base-200 border border-neutral rounded-lg shadow-lg py-2 px-2"
                itemTemplate={(value) => (
                  <span className="font-content">{value.label}</span>
                )}
                valueTemplate={(value) => (
                  <span className="text-base-content font-content">
                    {value.label}
                  </span>
                )}
              />
            </div>

            <div className="flex flex-wrap justify-between items-center gap-3">
              <span className="font-content text-base-content">
                Accent color
              </span>

              <div
                className="flex items-center gap-x-2"
                role="group"
                aria-label="Accent color options"
              >
                {ACCENT_COLORS.map((ac) => (
                  <button
                    key={ac.value}
                    type="button"
                    aria-label={`${ac.label} accent${accentColor === ac.value ? " (selected)" : ""}`}
                    aria-pressed={accentColor === ac.value}
                    onClick={() => setAccentColor(ac.value)}
                    className={`w-7 h-7 rounded-full transition-all ${
                      accentColor === ac.value
                        ? "ring-2 ring-offset-2 ring-base-content ring-offset-base-200 scale-110"
                        : "opacity-60 hover:opacity-100"
                    }`}
                    style={{ backgroundColor: ac.swatch }}
                  />
                ))}
              </div>
            </div>
          </div>
        </Panel>

        <hr className="mx-2 my-1 border-none h-[1.5px] bg-base-300" />

        <Button
          title="Give feedback"
          className="cursor-pointer custom-panel-header text-lg sm:text-xl w-full flex justify-between items-center px-2 py-4 rounded-xl bg-transparent border-transparent"
          // className="w-full py-4 px-2 bg-color4 font-subHeading text-lg sm:text-xl text-color1 rounded-xl"
          onClick={() => openFeedbackDialog()}
        >
          <h3 className="font-subHeading font-medium text-lg sm:text-xl text-base-content flex items-center">
            <span className="pi pi-comment mr-4 text-primary"></span>
            Feedback
          </h3>
        </Button>

        <hr className="mx-2 my-1 border-none h-[1.5px] bg-base-300" />

        <Panel
          headerTemplate={(options) => (
            <PanelHeader
              options={options}
              icon={<Share2 size={20} />}
              label="Share"
              isOpen={false}
            />
          )}
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

        <hr className="mx-2 my-1 border-none h-[1.5px] bg-base-300" />

        <a
          href={import.meta.env.VITE_DEVELOPER_PROFILE ?? ""}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="cursor-pointer custom-panel-header text-lg sm:text-xl w-full flex justify-between items-center px-2 py-4 rounded-xl"
          // className="w-full! block py-4 px-2 bg-color4 font-subHeading text-lg sm:text-xl text-color1 rounded-xl not-italic"
        >
          <h3 className="font-subHeading font-medium text-lg sm:text-xl text-base-content flex items-center">
            <span className="pi pi-github mr-4 text-primary"></span>
            Developer Profile
          </h3>
        </a>

        <hr className="mx-2 my-1 border-none h-[1.5px] bg-base-300" />

        {/* About This App */}
        <Panel
          headerTemplate={(options) => (
            <PanelHeader
              options={options}
              icon={<Info size={20} />}
              label="About This App"
              isOpen={false}
            />
          )}
          className="bg-transparent rounded-2xl"
          collapsed
          toggleable
        >
          <div className="flex flex-col gap-y-4 px-1 font-content">
            <div className="w-full flex flex-col gap-y-2">
              <div className="flex items-center justify-between">
                <span className="text-neutral-content">Version</span>
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-heading">
                  {__APP_VERSION__}
                </span>
              </div>
            </div>

            <hr className="border-none h-[1.5px] bg-base-300" />

            <div className="flex flex-col gap-y-2">
              <span className="text-neutral-content">Tools used</span>
              <div className="flex flex-wrap gap-2">
                {TECH_STACK?.map((tech) => (
                  <span
                    key={tech.label}
                    className="flex items-center gap-x-2 px-3 py-1 rounded-full bg-neutral text-neutral-content"
                    style={{ border: `1px solid ${tech.color}40` }}
                  >
                    <span
                      aria-hidden="true"
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: tech.color }}
                    />
                    <span>{tech.label}</span>
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
