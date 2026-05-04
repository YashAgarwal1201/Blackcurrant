import { Button } from "primereact/button";
import { Link, useLocation } from "react-router-dom";
import useNavStore from "../../Services/Stores/navStore";
import { Code, Hash, Home, Menu, Monitor, Type } from "lucide-react";
import { useState, useRef } from "react";

const navItems = [
  {
    to: "/home",
    icon: Home,
    label: "Home",
    title: "Go to home page",
    animation: "animate-icon-bounce",
  },
  {
    to: "/play-with-strings",
    icon: Type,
    label: "Strings",
    title: "Play with Strings",
    animation: "animate-icon-wiggle",
  },
  {
    to: "/play-with-numbers",
    icon: Hash,
    label: "Numbers",
    title: "Play with Numbers",
    animation: "animate-icon-pop",
  },
  {
    to: "/web-apis",
    icon: Monitor,
    label: "Web APIs",
    title: "Browser Vitals",
    animation: "animate-icon-pulse-scale",
  },
  {
    to: "/coditor-playground",
    icon: Code,
    label: "Coditor",
    title: "Coditor Playground",
    animation: "animate-icon-spin-once",
  },
];

const Navbar = () => {
  const { isSideMenuOpen, toggleSideMenu } = useNavStore();
  const { pathname } = useLocation();
  const [animatingKey, setAnimatingKey] = useState<string | null>(null);

  const prevPathname = useRef(pathname);
  const hasLeftHome = useRef(pathname !== "/home");

  const isHome = pathname === "/home";

  if (prevPathname.current !== pathname) {
    if (prevPathname.current === "/home" && pathname !== "/home") {
      hasLeftHome.current = false;
    }
    prevPathname.current = pathname;
  }

  const triggerAnimation = (key: string) => {
    setAnimatingKey(null);
    requestAnimationFrame(() => setAnimatingKey(key));
  };

  return (
    <div
      className={`
        header-card w-full md:w-[64px] h-[56px] md:h-full p-1
        flex flex-row md:flex-col justify-between items-center
        bg-color1 font-content select-none
        ${isHome ? "hidden" : "flex"}
        ${!hasLeftHome.current ? "navbar-slide-in-animated" : ""}
      `}
      onAnimationEnd={() => {
        hasLeftHome.current = true;
      }}
    >
      {/* Nav links */}
      <div className="w-fit md:w-full h-full md:h-fit flex flex-row md:flex-col items-center gap-1">
        {navItems.map(({ to, icon: Icon, label, title, animation }) => {
          const isActive =
            to === "/home" ? pathname === "/home" : pathname.startsWith(to);

          return (
            <Link
              key={to}
              to={to}
              title={title}
              aria-label={title}
              onClick={() => !isActive && triggerAnimation(to)}
              className={`flex flex-col justify-center items-center gap-y-1 px-2 py-1 rounded-xl ${isActive ? "pointer-events-none" : ""}`}
            >
              <span
                className={`px-3 py-1 rounded-full transition-colors duration-200 ${isActive ? "bg-color3" : "bg-transparent"}`}
              >
                <Icon
                  size={16}
                  fill={isActive ? "currentColor" : "none"}
                  className={`
                    ${isActive ? "text-color5" : "text-color4"}
                    ${animatingKey === to ? animation : ""}
                  `}
                  onAnimationEnd={() => setAnimatingKey(null)}
                />
              </span>
              <span
                className={`text-xs transition-colors duration-200 ${isActive ? "text-color3 font-bold" : "text-color4 font-normal"}`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Menu button */}
      <div className="w-auto md:w-full h-full md:h-auto flex items-center justify-center">
        <Button
          title="Open side menu"
          aria-label="Side menu btn"
          onClick={() => {
            triggerAnimation("menu");
            toggleSideMenu();
          }}
          className="flex flex-col justify-center items-center gap-y-1 px-2 py-1 !bg-transparent border-none rounded-xl"
        >
          <span
            className={`px-3 py-1 rounded-full transition-colors duration-200 ${isSideMenuOpen ? "bg-color3" : "bg-transparent"}`}
          >
            <Menu
              size={16}
              fill={isSideMenuOpen ? "currentColor" : "none"}
              className={`
                ${isSideMenuOpen ? "text-color5" : "text-color4"}
                ${animatingKey === "menu" ? "animate-icon-expand-nudge" : ""}
              `}
              onAnimationEnd={() => setAnimatingKey(null)}
            />
          </span>
          <span
            className={`text-xs transition-colors duration-200 ${isSideMenuOpen ? "text-color3 font-bold" : "text-color4 font-normal"}`}
          >
            Menu
          </span>
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
