import { Button } from "primereact/button";
import { Link, useLocation } from "react-router-dom";
import useNavStore from "../../Services/Stores/navStore";
import { Code, Hash, Home, Menu, Monitor, Type } from "lucide-react";

const navItems = [
  {
    to: "/home",
    icon: Home,
    label: "Home",
    title: "Go to home page",
  },
  {
    to: "/play-with-strings",
    icon: Type,
    label: "Strings",
    title: "Play with Strings",
  },
  {
    to: "/play-with-numbers",
    icon: Hash,
    label: "Numbers",
    title: "Play with Numbers",
  },
  {
    to: "/browser-vitals",
    icon: Monitor,
    label: "Vitals",
    title: "Browser Vitals",
  },
  {
    to: "/coditor-playground",
    icon: Code,
    label: "Coditor",
    title: "Coditor Playground",
  },
];

const Navbar = () => {
  const { isSideMenuOpen, toggleSideMenu } = useNavStore();
  const { pathname } = useLocation();

  const isHome = pathname === "/home";

  if (isHome) return null;

  return (
    <nav
      aria-label="Main navigation"
      className="header-card w-full h-full p-1 grid grid-cols-6 md:flex md:flex-col md:justify-center md:items-center bg-color1 font-content select-none"
    >
      {/* Nav links */}

      {navItems.map(({ to, icon: Icon, label, title }) => {
        const isActive =
          to === "/home" ? pathname === "/home" : pathname.startsWith(to);

        return (
          <Link
            aria-current={isActive ? "page" : undefined}
            key={to}
            to={to}
            aria-label={title}
            className={`group flex flex-col justify-center items-center gap-y-1 px-2 py-1 rounded-xl ${isActive ? "pointer-events-none" : ""}`}
          >
            <span
              className={`px-3 py-1 rounded-full transition-colors duration-200 ${isActive ? "bg-color5" : "bg-transparent"}`}
            >
              <Icon
                size={16}
                fill={isActive ? "currentColor" : "none"}
                className={`
                    transition-transform duration-300
                    ${isActive ? "text-color1 animate-icon-pop" : "text-color4 group-hover:animate-icon-wiggle"}
                  `}
              />
            </span>
            <span
              className={`text-xs transition-colors duration-200 ${isActive ? "text-color5 font-bold" : "text-color4 font-normal"}`}
            >
              {label}
            </span>
          </Link>
        );
      })}

      {/* Menu button */}
      <div className="w-auto md:w-full h-full md:h-auto flex items-center justify-center">
        <Button
          title="Open side menu"
          aria-label="Side menu btn"
          onClick={toggleSideMenu}
          className="group flex flex-col justify-center items-center gap-y-1 px-2 py-1 !bg-transparent border-none rounded-xl"
        >
          <span
            className={`px-3 py-1 rounded-full transition-colors duration-200 ${isSideMenuOpen ? "bg-color5" : "bg-transparent"}`}
          >
            <Menu
              size={16}
              fill={isSideMenuOpen ? "currentColor" : "none"}
              className={`
                transition-transform duration-300
                ${isSideMenuOpen ? "text-color1 animate-icon-pop" : "text-color4 group-hover:animate-icon-wiggle"}
              `}
            />
          </span>
          <span
            className={`text-xs transition-colors duration-200 ${isSideMenuOpen ? "text-color5 font-bold" : "text-color4 font-normal"}`}
          >
            Menu
          </span>
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
