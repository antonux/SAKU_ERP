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
    <div className="font-sans">
      <Navbar />
      <Sidebar />
      <div className="bg-[#f8f9fd] min-h-screen">
        <Routes>
          {role === "admin" && <Route path="/*" element={<AdminRoutes />} />}
          {role === "store" && <Route path="/*" element={<StoreRoutes />} />}
          {role === "warehouse" && <Route path="/*" element={<WarehouseRoutes />} />}
          <Route path="" element={<Navigate to="/error" />} />
        </Routes>
      </div>
    </div>
  );
};

export default AppRoutes;
