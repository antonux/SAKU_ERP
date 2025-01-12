import * as Icons from 'react-icons/md';
import * as FaIcons from 'react-icons/fa';
import * as IoIcons from 'react-icons/io';
import * as BiIcons from 'react-icons/bi';
import * as VscIcons from 'react-icons/vsc';

const roleConfig = {
  admin: {
    sidebarLinks: [
      { name: "Inventory", path: "/inventory", icon: Icons.MdOutlineInventory2 },
      { name: "Request", path: "/request", icon: VscIcons.VscGitPullRequest },
      { name: "Purchase", path: "/purchase", icon: FaIcons.FaMoneyBill },
      { name: "Suppliers", path: "/suppliers", icon: FaIcons.FaBoxes },
      { name: "Accounts", path: "/accounts", icon: FaIcons.FaUsers },
      { name: "Notification", path: "/notifications", icon: IoIcons.IoMdNotifications },
    ],
  },
  store: {
    sidebarLinks: [
      { name: "Inventory", path: "/inventory", icon: Icons.MdOutlineInventory2 },
      { name: "Request", path: "/request", icon: VscIcons.VscGitPullRequest },
      { name: "Notification", path: "/notifications", icon: IoIcons.IoMdNotifications },
    ],
  },
  manager: {
    sidebarLinks: [
      { name: "Inventory", path: "/inventory", icon: Icons.MdOutlineInventory2 },
      { name: "Request", path: "/request", icon: VscIcons.VscGitPullRequest },
      { name: "Notification", path: "/notifications", icon: IoIcons.IoMdNotifications },
    ],
  },
  warehouse: {
    sidebarLinks: [
      { name: "Inventory", path: "/inventory", icon: Icons.MdOutlineInventory2 },
      { name: "Request", path: "/request", icon: VscIcons.VscGitPullRequest },
      { name: "Purchase", path: "/purchase", icon: FaIcons.FaMoneyBill },
      { name: "Suppliers", path: "/suppliers", icon: FaIcons.FaBoxes },
      { name: "Notification", path: "/notifications", icon: IoIcons.IoMdNotifications },
    ],
  },
};

export default roleConfig;