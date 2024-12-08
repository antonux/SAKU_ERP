import { React, useState } from "react";
import roleConfig from "../utils/roleConfig";
// context
import { useSidebar } from "../contexts/SideBarContext";
import { useRole } from "../contexts/RoleContext";
// others
import { NavLink } from 'react-router-dom';
import { MdLogout } from "react-icons/md";

const Sidebar = () => {
  const { user } = useRole();
  const links = roleConfig[user]?.sidebarLinks || [];
  const { isSidebarOpen } = useSidebar();


  return (
    <aside
      className={`flex flex-col items-center shadow-md sidebar sticky top-0 left-0 bg-white h-auto transition-all duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0 w-64" : "-translate-x-[10rem] w-0"
        }`}
    >
      <h1 className="pt-6 font-extrabold tracking-wide text-3xl bg-gradient-to-r from-[#2CC56F] to-[#BEDC7C] bg-clip-text text-transparent">
        SAKU
      </h1>
      <div className="flex flex-col gap-2 pt-12 pr-6">
        {links.map((link) => (
          <li key={link.name} className="flex">
            <NavLink
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-2 font-medium px-[5.9rem] py-[.9rem] relative
          ${isActive ? "text-green-500" : "text-[#666973] hover:scale-105 hover:text-[#858891]"}`}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="w-[.45rem] rounded-full h-full bg-green-500 absolute left-0 translate-x-[2.5rem] z-50"></div>
                  )}
                  {isActive && (
                    <div className="absolute w-64 z-0 h-full bg-[#e9f9f0] translate-x-[-3.4rem]"></div>
                  )}
                  <link.icon className="mr-2 size-5 z-50" />
                  <div className="z-50">{link.name}</div>
                </>
              )}
            </NavLink>
          </li>
        ))}
        {/* <h1 className="flex items-center mt-[30%] gap-2 font-medium px-[5.9rem] py-[.9rem] text-[#666973]"><MdLogout className="mr-2 size-5 z-50" /> Logout</h1> */}
      </div>

    </aside>
  );
};

export default Sidebar;