const roleConfig = {
  admin: {
    sidebarLinks: [
      { name: "Dashboard", path: "/dashboard" },
      { name: "Requests", path: "/requests" },
      { name: "User Management", path: "/admin/users" },
    ],
  },
  store: {
    sidebarLinks: [
      { name: "Dashboard", path: "/dashboard" },
      { name: "Requests", path: "/requests" },
      { name: "Store Orders", path: "/store/orders" },
    ],
  },
  warehouse: {
    sidebarLinks: [
      { name: "Dashboard", path: "/dashboard" },
      { name: "Requests", path: "/requests" },
      { name: "Stock Management", path: "/warehouse/stocks" },
    ],
  },
};

export default roleConfig;