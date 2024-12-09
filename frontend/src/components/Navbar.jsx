import React from "react";

// context
import { useSidebar } from "../contexts/SideBarContext";
import { useRole } from "../contexts/RoleContext";
import { useNavigate } from "react-router-dom";


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
        <div className={`${isSidebarOpen ? "mr-[18rem]" : "mr-[2rem]"}`}>
          <button
            onClick={() => handleLogout()}
            className="underline">
          log out
        </button>
      </div>
    </div>
    </nav >
  );
};

export default Navbar;