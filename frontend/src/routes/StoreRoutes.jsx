import React from "react";
import { Routes, Route } from "react-router-dom";

// pages
import Settings from "../pages/Shared/Settings";
import Overview from "../pages/Shared/Overview";
import Request from "../pages/Store/Request";
import Inventory from "../pages/Store/Inventory";
import Notifications from "../pages/Shared/Notifications";
import RequestViewMore from "../pages/Shared/RequestViewMore";
import AcknowledgeReceipt from "../pages/Shared/RestockAcknowledge";
import ProductRequest from "../pages/Store/RequestProductRequest";

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
          path="/notifications"
          element={<Notifications />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />

        <Route
          path="/request/view-more"
          element={<RequestViewMore />}
        />

        <Route
          path="/request/acknowledge-receipt"
          element={<AcknowledgeReceipt />}
        />
        
        <Route
          path="/request/product-request"
          element={<ProductRequest />}
        />

      </Routes>
    </div>
  );
};

export default AdminRoutes;
