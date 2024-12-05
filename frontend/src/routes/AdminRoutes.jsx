import React from "react";
import { Routes, Route } from "react-router-dom";
// import Overview from "../pages/Shared/overview";
// import Dashboard from "../pages/Admin/dashboard";
// import Users from "../pages/Admin/users";

// pages
import Settings from "../pages/Shared/Settings";
import Overview from "../pages/Shared/overview";
import Request from "../pages/Admin/Request";
import Inventory from "../pages/Admin/Inventory";

const AdminRoutes = () => {
  return (
    <div className="">
      <Routes>
        {/* <Route path="/" element={<Overview />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/users" element={<Users />} /> */}
        {/* Add more admin-specific routes as needed */}

        <Route
          path="/shared/overview"
          element={<Overview />}
        />

        <Route
          path="/shared/settings"
          element={<Settings />}
        />

        <Route
          path="/admin/request"
          element={<Request />}
        />

        <Route
          path="/admin/inventory"
          element={<Inventory />}
        />

      </Routes>
    </div>
  );
};

export default AdminRoutes;
