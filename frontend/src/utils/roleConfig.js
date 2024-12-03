import * as Icons from 'react-icons/md';
import * as FaIcons from 'react-icons/fa';
import * as IoIcons from 'react-icons/io';
import * as BiIcons from 'react-icons/bi';
import * as VscIcons from 'react-icons/vsc';

const roleConfig = {
  admin: {
    sidebarLinks: [
      { name: "Overview", path: "/shared/overview", icon: Icons.MdOutlineDashboard },
      { name: "Inventory", path: "/admin/inventory", icon: Icons.MdOutlineInventory2 },
      { name: "Request", path: "/admin/request", icon: VscIcons.VscGitPullRequest },
      { name: "Purchase", path: "/admin/purchase", icon: FaIcons.FaMoneyBill },
      { name: "Suppliers", path: "/admin/suppliers", icon: FaIcons.FaBoxes },
      { name: "Accounts", path: "/admin/accounts", icon: FaIcons.FaUsers },
      { name: "Notification", path: "/admin/notifications", icon: IoIcons.IoMdNotifications },
      { name: "Settings", path: "/shared/settings", icon: BiIcons.BiCog },
    ],
  },
  store: {
    sidebarLinks: [
      { name: "Overview", path: "/shared/overview", icon: Icons.MdOutlineDashboard },
      { name: "Inventory", path: "/store/inventory", icon: FaIcons.FaBox },
      { name: "Request", path: "/store/request", icon: FaIcons.FaBox },
      { name: "Notification", path: "/store/notifications", icon: IoIcons.IoMdNotifications },
      { name: "Settings", path: "/shared/settings", icon: BiIcons.BiCog },
    ],
  },
  warehouse: {
    sidebarLinks: [
      { name: "Overview", path: "/shared/overview", icon: Icons.MdOutlineDashboard },
      { name: "Inventory", path: "/warehouse/inventory", icon: FaIcons.FaBox },
      { name: "Request", path: "/warehouse/request", icon: FaIcons.FaBox },
      { name: "Purchase", path: "/warehouse/purchase", icon: FaIcons.FaBox },
      { name: "Suppliers", path: "/warehouse/suppliers", icon: FaIcons.FaBox },
      { name: "Notification", path: "/warehouse/notifications", icon: IoIcons.IoMdNotifications },
      { name: "Settings", path: "/shared/settings", icon: BiIcons.BiCog },
    ],
  },
};

export default roleConfig;