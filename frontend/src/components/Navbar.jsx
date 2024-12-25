import React from "react";

// context
import { useSidebar } from "../contexts/SideBarContext";
import { useRole } from "../contexts/RoleContext";
import { useNavigate } from "react-router-dom";

import { RiLogoutBoxRLine } from "react-icons/ri";

const Navbar = () => {
  const { user } = useRole();
  const { toggleSidebar, isSidebarOpen } = useSidebar();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/")
    window.location.reload();
  };

  return (
    <nav className={`navbar fixed top-0 bg-white z-50 w-full text-[#373737] px-4 py-6 flex gap-6 items-center transition-all duration-300 ease-in-out ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
      <div className="flex justify-between w-full">
        <div className="flex gap-6 items-center">
          <button className="text-[#373737] text-xl" onClick={toggleSidebar}>
            ☰
          </button>
          <h1 className="text-based font-medium">{user}</h1>
        </div>
        <div className={`flex items-center gap-2 hover:scale-105 transition-all ${isSidebarOpen ? "mr-[18rem]" : "mr-[2rem]"}`}>
          <RiLogoutBoxRLine className="size-5" />
          <button
            onClick={() => handleLogout()}
            className="text-[#666973]  font-medium transition-all">
          Logout
        </button>
      </div>
    </div>
    </nav >
  );
};

export default Navbar;