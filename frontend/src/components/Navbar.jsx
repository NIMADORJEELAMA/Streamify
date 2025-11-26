import {
  Search,
  Menu,
  Home,
  Users,
  MessageSquare,
  PlayCircle,
  Bell,
} from "lucide-react";

import useAuthUser from "../hooks/useAuthUser";
import useLogout from "../hooks/useLogout";
import { Link, useLocation } from "react-router";
import ThemeSelector from "./ThemeSelector";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const { logoutMutation } = useLogout();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-full bg-base-100 border-b border-base-300 shadow-sm fixed top-0 z-50">
      {/* ---------------- MOBILE HEADER ---------------- */}
      <div className="flex items-center justify-between p-3 md:hidden">
        <Link to="/">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_(2019).png"
            alt="facebook"
            className="h-6"
          />
        </Link>

        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full bg-base-200">
            <Search className="h-5 w-5" />
          </button>
          <button className="p-2 rounded-full bg-base-200">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* ---------------- MOBILE ICONS ROW ---------------- */}
      <div className="flex justify-around py-2 border-t border-base-300 md:hidden bg-base-100">
        <NavMobileItem to="/" active={isActive("/")}>
          <Home className="h-6 w-6" />
        </NavMobileItem>

        <NavMobileItem to="/friends" active={isActive("/friends")}>
          <Users className="h-6 w-6" />
        </NavMobileItem>

        <NavMobileItem to="/messages" active={isActive("/messages")}>
          <MessageSquare className="h-6 w-6" />
        </NavMobileItem>

        <NavMobileItem to="/videos" active={isActive("/videos")}>
          <PlayCircle className="h-6 w-6" />
        </NavMobileItem>

        <NavMobileItem to="/notifications" active={isActive("/notifications")}>
          <Bell className="h-6 w-6" />
        </NavMobileItem>
      </div>

      {/* ---------------- DESKTOP NAVBAR ---------------- */}
      <div className="hidden md:flex items-center justify-between px-6 h-16">
        <Link to="/" className="flex items-center">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_(2019).png"
            alt="logo"
            className="h-8"
          />
        </Link>

        {/* Center icons */}
        <div className="flex items-center gap-10">
          <NavDesktopItem to="/" active={isActive("/")}>
            <Home className="h-7 w-7" />
          </NavDesktopItem>

          <NavDesktopItem to="/friends" active={isActive("/friends")}>
            <Users className="h-7 w-7" />
          </NavDesktopItem>

          <NavDesktopItem to="/messages" active={isActive("/messages")}>
            <MessageSquare className="h-7 w-7" />
          </NavDesktopItem>

          <NavDesktopItem to="/videos" active={isActive("/videos")}>
            <PlayCircle className="h-7 w-7" />
          </NavDesktopItem>

          <NavDesktopItem
            to="/notifications"
            active={isActive("/notifications")}
          >
            <Bell className="h-7 w-7" />
          </NavDesktopItem>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <Link to="/profile">
            <div className="avatar cursor-pointer">
              <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src={authUser?.profilePic} alt="User" />
              </div>
            </div>
          </Link>
          <ThemeSelector />

          <button className="btn btn-ghost btn-circle" onClick={logoutMutation}>
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

/* --------------------------------------
   MOBILE NAV ITEM (WITH ACTIVE COLOR)
--------------------------------------- */
const NavMobileItem = ({ to, active, children }) => (
  <Link to={to}>
    <div className="relative flex flex-col items-center">
      <div className={active ? "text-primary" : "opacity-70"}>{children}</div>
      {active && <div className="w-8 h-1 bg-primary rounded-full mt-1"></div>}
    </div>
  </Link>
);

/* --------------------------------------
   DESKTOP NAV ITEM (WITH ACTIVE UNDERLINE)
--------------------------------------- */
const NavDesktopItem = ({ to, active, children }) => (
  <Link to={to} className="relative flex flex-col items-center">
    <div className={active ? "text-primary" : "opacity-70"}>{children}</div>
    {active && (
      <div className="absolute -bottom-3 w-14 h-1 bg-primary rounded-full" />
    )}
  </Link>
);

export default Navbar;
