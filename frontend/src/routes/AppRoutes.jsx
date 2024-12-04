import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
// import { useRole } from "../hooks/useRole";

import AdminRoutes from "../routes/AdminRoutes";
// import StoreRoutes from "../routes/StoreRoutes";
// import WarehouseRoutes from "../routes/StoreRoutes";

//components
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";

const AppRoutes = () => {
  // const { role } = useRole();
  const role = "admin";

  return (
      <div className="flex flex-col w-full h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 bg-[#f8f9fd] px-5 overflow-y-auto">
          <Routes>
            {role === "admin" && <Route path="/*" element={<AdminRoutes />} />}
            {role === "store" && <Route path="/*" element={<StoreRoutes />} />}
            {role === "warehouse" && <Route path="/*" element={<WarehouseRoutes />} />}
            <Route path="" element={<Navigate to="/error" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AppRoutes;
