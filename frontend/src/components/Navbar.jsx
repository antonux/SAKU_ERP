import React from "react";
import { useSidebar } from "../contexts/SidebarContext";

const Navbar = () => {
  const { toggleSidebar, isSidebarOpen } = useSidebar();
  return (
    <nav className={`navbar fixed bg-white z-50 w-full text-[#373737] px-4 py-6 flex gap-6 items-center transition-all duration-300 ease-in-out ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
      <button className="text-[#373737] text-xl" onClick={toggleSidebar}>
        ☰ 
      </button>
      <h1 className="text-based font-medium">Admin</h1>
    </nav>
  );
};

export default Navbar;