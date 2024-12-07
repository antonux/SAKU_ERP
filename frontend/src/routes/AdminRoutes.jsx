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
import Accounts from "../pages/Admin/Accounts";
import Notifications from "../pages/Shared/Notifications";
import Suppliers from "../pages/Shared/Suppliers";

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
          path="/admin/request"
          element={<Request />}
        />

        <Route
          path="/admin/inventory"
          element={<Inventory />}
        />

        <Route
          path="/admin/suppliers"
          element={<Suppliers />}
        />

        <Route
          path="/admin/accounts"
          element={<Accounts />}
        />

        <Route
          path="/admin/notifications"
          element={<Notifications />}
        />

        <Route
          path="/shared/settings"
          element={<Settings />}
        />

      </Routes>
    </div>
  );
};

export default AdminRoutes;
