import React from "react";
import { Routes, Route } from "react-router-dom";

// pages
import Settings from "../pages/Shared/Settings";
import Overview from "../pages/Shared/Overview";
import Request from "../pages/Warehouse/Request";
import Purchase from "../pages/Warehouse/Purchase";
import Inventory from "../pages/Shared/Inventory";
import Accounts from "../pages/Admin/Accounts";
import Notifications from "../pages/Shared/Notifications";
import Suppliers from "../pages/Shared/Suppliers";
import AddStock from "../pages/Shared/InventoryAddStock";
import ViewStock from "../pages/Shared/InventoryViewProduct";
import RequestViewMore from "../pages/Warehouse/RequestViewMore";
import AcknowledgeReceipt from "../pages/Shared/RestockAcknowledge";
import AddSupplier from "../pages/Shared/SuppliersAddSupplier";
import AddAccount from "../pages/Admin/AccountsAddAccount";
import ViewSupplier from "../pages/Shared/SuppliersViewSupplier";
import ViewAccount from "../pages/Admin/AccountsViewAccount";
import ProductOrderForm from "../pages/Warehouse/RequestPurchaseRequest";
import PurchaseViewMore from "../pages/Warehouse/PurchaseViewMore";

const WarehouseRoutes = () => {
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
          path="/purchase"
          element={<Purchase />}
        />

        <Route
          path="/purchase/view-more"
          element={<PurchaseViewMore />}
        />

        <Route
          path="/inventory"
          element={<Inventory />}
        />

        <Route
          path="/suppliers"
          element={<Suppliers />}
        />

        <Route
          path="/suppliers/add-supplier"
          element={<AddSupplier />}
        />

        <Route
          path="/suppliers/view-supplier"
          element={<ViewSupplier />}
        />

        <Route
          path="/accounts"
          element={<Accounts />}
        />

        <Route
          path="/accounts/add-account"
          element={<AddAccount />}
        />

        <Route
          path="/accounts/view-account"
          element={<ViewAccount />}
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
          path="/inventory/add-stock"
          element={<AddStock />}
        />

        <Route
          path="/inventory/view-stock"
          element={<ViewStock />}
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
          path="/request/purchase-request"
          element={<ProductOrderForm />}
        />

      </Routes>
    </div>
  );
};

export default WarehouseRoutes;
