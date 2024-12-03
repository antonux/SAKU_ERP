import React from "react";
import roleConfig from "../utils/roleConfig";
// context
import { useSidebar } from "../contexts/SidebarContext";
import { NavLink } from 'react-router-dom';

const Sidebar = ({ role }) => {
  const links = roleConfig["admin"]?.sidebarLinks || [];
  const { isSidebarOpen } = useSidebar();


  return (
    <aside
      className={`flex flex-col items-center sidebar bg-white w-64 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 fixed h-full`}
    >
      <h1 className="pt-6 font-extrabold tracking-wide text-3xl bg-gradient-to-r from-[#2CC56F] to-[#BEDC7C] bg-clip-text text-transparent">
        SAKU
      </h1>
      <div className="flex flex-col gap-11 pt-14 pr-6">
         {links.map((link) => (
        <li key={link.name} className="flex">
          {<link.icon className="mr-2 size-5 text-[#666973]" />}
          <NavLink 
            to={link.path} 
            className={({ isActive }) => 
              isActive
                ? "text-blue-500 font-medium" // Styles for active link
                : "text-[#666973] font-medium" // Styles for inactive link
            }
          >
            {link.name}
          </NavLink>
        </li>
      ))}
      </div>
    </aside>
  );
};

export default Sidebar;