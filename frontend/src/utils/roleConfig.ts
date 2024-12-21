import * as Icons from 'react-icons/md';
import * as FaIcons from 'react-icons/fa';
import * as IoIcons from 'react-icons/io';
import * as BiIcons from 'react-icons/bi';
import * as VscIcons from 'react-icons/vsc';

const roleConfig = {
  admin: {
    sidebarLinks: [
      { name: "Overview", path: "/overview", icon: Icons.MdOutlineDashboard },
      { name: "Inventory", path: "/inventory", icon: Icons.MdOutlineInventory2 },
      { name: "Request", path: "/request", icon: VscIcons.VscGitPullRequest },
      { name: "Purchase", path: "/purchase", icon: FaIcons.FaMoneyBill },
      { name: "Suppliers", path: "/suppliers", icon: FaIcons.FaBoxes },
      { name: "Accounts", path: "/accounts", icon: FaIcons.FaUsers },
      { name: "Notification", path: "/notifications", icon: IoIcons.IoMdNotifications },
      { name: "Settings", path: "/settings", icon: BiIcons.BiCog },
    ],
  },
  store: {
    sidebarLinks: [
      { name: "Overview", path: "/overview", icon: Icons.MdOutlineDashboard },
      { name: "Inventory", path: "/inventory", icon: Icons.MdOutlineInventory2 },
      { name: "Request", path: "/request", icon: VscIcons.VscGitPullRequest },
      { name: "Notification", path: "/notifications", icon: IoIcons.IoMdNotifications },
      { name: "Settings", path: "/settings", icon: BiIcons.BiCog },
    ],
  },
  manager: {
    sidebarLinks: [
      { name: "Overview", path: "/overview", icon: Icons.MdOutlineDashboard },
      { name: "Inventory", path: "/inventory", icon: Icons.MdOutlineInventory2 },
      { name: "Request", path: "/request", icon: VscIcons.VscGitPullRequest },
      { name: "Notification", path: "/notifications", icon: IoIcons.IoMdNotifications },
      { name: "Settings", path: "/settings", icon: BiIcons.BiCog },
    ],
  },
  warehouse: {
    sidebarLinks: [
      { name: "Overview", path: "/overview", icon: Icons.MdOutlineDashboard },
      { name: "Inventory", path: "/inventory", icon: FaIcons.FaBox },
      { name: "Request", path: "/request", icon: FaIcons.FaBox },
      { name: "Purchase", path: "/purchase", icon: FaIcons.FaBox },
      { name: "Suppliers", path: "/suppliers", icon: FaIcons.FaBox },
      { name: "Notification", path: "/notifications", icon: IoIcons.IoMdNotifications },
      { name: "Settings", path: "/settings", icon: BiIcons.BiCog },
    ],
  },
};

export default roleConfig;