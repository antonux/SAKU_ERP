import React from "react";
import { Routes, Route } from "react-router-dom";

// pages
import Settings from "../pages/Shared/Settings";
import Overview from "../pages/Shared/Overview";
import Request from "../pages/Admin/Request";
import Inventory from "../pages/Store/Inventory";
import Notifications from "../pages/Shared/Notifications";
import RequestViewMore from "../pages/Admin/RequestViewMore";

const AdminRoutes = () => {
  return (
    <div className="">
      <Routes>
        {/* <Route path="/" element={<Overview />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/users" element={<Users />} /> */}
        {/* Add more admin-specific routes as needed */}

        <Route
          path="/overview"
          element={<Overview />}
        />

        <Route
          path="/request"
          element={<Request />}
        />

        <Route
          path="/inventory"
          element={<Inventory />}
        />


        <Route
          path="/admin/notifications"
          element={<Notifications />}
        />

        <Route
          path="/shared/settings"
          element={<Settings />}
        />

        <Route
          path="/admin/request/view-more"
          element={<RequestViewMore />}
        />

      </Routes>
    </div>
  );
};

export default AdminRoutes;
