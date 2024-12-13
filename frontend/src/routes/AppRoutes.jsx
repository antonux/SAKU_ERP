import { useEffect, React } from "react";
import {useNavigate, Routes, Route, Navigate } from "react-router-dom";
// import { useRole } from "../hooks/useRole";

// routes
import AdminRoutes from "../routes/AdminRoutes";
import StoreRoutes from "../routes/StoreRoutes";

// components
import Navbar from "../components/navbar";
import Sidebar from "../components/Sidebar";

// login
import Login from '../pages/Shared/Login'

// contexts
import { useRole } from "../contexts/RoleContext";

const AppRoutes = () => {
  const { user } = useRole();

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden">
      {user && <Navbar />}
      <div className="flex flex-1">
        {user && <Sidebar />}
        <div className="flex-1 bg-[#f8f9fd] px-5 min-w-0">
          <Routes>
            {!user &&
              <Route
                path="/"
                element={<Login />}
              />
            }
            {user === "admin" && <Route path="/*" element={<AdminRoutes />} />}
            {user === "store" && <Route path="/*" element={<StoreRoutes />} />}
            {user === "warehouse" && <Route path="/*" element={<WarehouseRoutes />} />}
            <Route path="" element={<Navigate to="/overview" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AppRoutes;
