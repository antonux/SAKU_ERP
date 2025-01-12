import React, { useState, useEffect } from "react";
import axios from "axios";

// contexts
import { useRole } from "../../contexts/RoleContext";

// Heroicons (you can replace this with any icon library)
import {
  BellIcon,
  DotsHorizontalIcon,
  CheckCircleIcon,
} from "@heroicons/react/outline";

const Notifications = () => {
  const [notifications, setNotifications] = useState({
    today: [],
    yesterday: [],
    older: [],
  });
  const [unreadCount, setUnreadCount] = useState(0);
  const [showMenu, setShowMenu] = useState(null); // Track the open menu
  // const [markedAsRead, setMarkedAsRead] = useState(false); // Track the open menu

  // contexts
  const { user, userID, markedAsRead, setMarkedAsRead } = useRole();

  // Fetch notifications on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/notification",
          {
            params: { userId: userID },
          }
        );

        let unreadCount = 0;
        const notifications = response.data.notifications;

        // Sort notifications by `created_at` in descending order (latest first)
        const sortedNotifications = notifications.sort((a, b) => {
          const dateA = new Date(a.created_at).getTime();
          const dateB = new Date(b.created_at).getTime();
          return dateB - dateA; // Sort in descending order (newest first)
        });

        // Categorize the sorted notifications
        const todayNotifications = [];
        const yesterdayNotifications = [];
        const olderNotifications = [];

        sortedNotifications.forEach((notification) => {
          const isUnread = notification.user_status === "unread";
          if (isUnread) unreadCount++;

          // Categorize by date
          const notificationDate = new Date(notification.created_at);
          const today = new Date();
          const yesterday = new Date(today);
          yesterday.setDate(today.getDate() - 1);

          if (notificationDate.toDateString() === today.toDateString()) {
            todayNotifications.push({ ...notification, isUnread });
          } else if (
            notificationDate.toDateString() === yesterday.toDateString()
          ) {
            yesterdayNotifications.push({ ...notification, isUnread });
          } else {
            olderNotifications.push({ ...notification, isUnread });
          }
        });

        setNotifications({
          today: todayNotifications,
          yesterday: yesterdayNotifications,
          older: olderNotifications,
        });
        setUnreadCount(unreadCount);
      } catch (error) {
        console.error("Error fetching notifications:", error.message);
      }
    };

    fetchNotifications();
  }, [userID, markedAsRead]);

  const formatDate = (date) => {
    const optionsDate = { year: "numeric", month: "long", day: "numeric" };
    const optionsTime = { hour: "numeric", minute: "2-digit", hour12: true };

    const formattedDate = new Date(date).toLocaleDateString(
      undefined,
      optionsDate
    );
    const formattedTime = new Date(date).toLocaleTimeString(
      undefined,
      optionsTime
    );

    return `${formattedDate}, ${formattedTime}`;
  };
  const formatTime = (date) => {
    const optionsTime = { hour: "numeric", minute: "2-digit", hour12: true };

    return new Date(date).toLocaleTimeString(undefined, optionsTime);
  };

  // Handle menu toggle
  const toggleMenu = (notifId) => {
    setShowMenu(showMenu === notifId ? null : notifId);
  };

  // Handle "Mark as Read" action
  const markAsRead = (notifId) => {
    console.log("Marking notification as read:", notifId);
    axios
      .post("http://localhost:4000/api/notification/mark-as-read", {
        user_notif_id: notifId,
      })
      .then((response) => {
        console.log("Notification marked as read:", response.data);
        setShowMenu(null);
        setMarkedAsRead((prevState) => !prevState);
      })
      .catch((error) => {
        console.error("Error marking notification as read:", error);
      });
  };

  return (
    <div className="flex flex-col gap-4 h-screen pb-5">
      <div className="px-10 py-3 mt-[6rem] flex shrink-0 h-[5rem] justify-between items-center w-full shadow-md overflow-auto rounded-lg bg-white text-black">
        <h1 className="text-2xl font-semibold">
          Notifications ({unreadCount} unread)
        </h1>
      </div>

      <div className="px-10 py-6  flex flex-col gap-6 flex-grow overflow-auto scrollbar-thin rounded-lg bg-white shadow-md">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-medium">
              {notifications.today.length > 0
                ? "Today"
                : "No Notifications Today"}
            </h2>
          </div>
          {notifications.today.map((notification) => (
            <div
              key={notification.user_notif_id}
              className={`flex gap-4 p-4 rounded-lg items-center ${
                notification.isUnread ? "bg-blue-50" : "bg-white"
              }`}
            >
              <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full">
                {notification.isUnread ? (
                  <BellIcon className="w-6 h-6 text-blue-500" />
                ) : (
                  <CheckCircleIcon className="w-6 h-6 text-green-500" />
                )}
              </div>
              <div className="flex-grow">
                <p
                  className={`text-sm text-gray-800 ${
                    notification.isUnread ? "font-bold" : ""
                  }`}
                >
                  {notification.message}
                </p>
                <span className="text-xs text-gray-500">
                  {formatTime(notification.created_at)}
                </span>
              </div>
              <div className="flex items-center justify-center">
                {true && notification.isUnread && (
                  <div className="w-40 mt-2 bg-blue-200 rounded-lg z-10">
                    <button
                      onClick={() => markAsRead(notification.user_notif_id)}
                      className={`${
                        notification.isUnread ? "block" : "hidden"
                      } w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                    >
                      Mark as Read
                    </button>
                  </div>
                )}
              </div>
              {notification.isUnread && (
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 translate-y-[-15px]" />
              )}
            </div>
          ))}
        </div>

        {/* Only display Yesterday section if there are notifications */}
        {notifications.yesterday.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-medium">Yesterday</h2>
            </div>
            {notifications.yesterday.map((notification) => (
              <div
                key={notification.user_notif_id}
                className={`flex gap-4 p-4 rounded-lg items-center ${
                  notification.isUnread ? "bg-blue-50" : "bg-white"
                }`}
              >
                <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full">
                  {notification.isUnread ? (
                    <BellIcon className="w-6 h-6 text-blue-500" />
                  ) : (
                    <CheckCircleIcon className="w-6 h-6 text-green-500" />
                  )}
                </div>
                <div className="flex-grow">
                  <p
                    className={`text-sm text-gray-800 ${
                      notification.isUnread ? "font-bold" : ""
                    }`}
                  >
                    {notification.message}
                  </p>
                  <span className="text-xs text-gray-500">
                    {formatTime(notification.created_at)}
                  </span>
                </div>
                {notification.isUnread && (
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 translate-y-[-15px]" />
                )}
                <div className="relative">
                  <button
                    onClick={() => toggleMenu(notification.user_notif_id)}
                  >
                    <DotsHorizontalIcon className="w-5 h-5 text-gray-600 translate-y-[-8px]" />
                  </button>
                  {showMenu === notification.user_notif_id && (
                    <div className="absolute right-0 w-40 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                      <button
                        onClick={() => markAsRead(notification.user_notif_id)}
                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Mark as Read
                      </button>
                      <button
                        onClick={() =>
                          console.log(
                            "View notification",
                            notification.user_notif_id
                          )
                        }
                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        View
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Display notifications older than yesterday with formatted date */}
        {notifications.older.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-medium">Older</h2>
            </div>
            {notifications.older.map((notification) => (
              <div
                key={notification.user_notif_id}
                className={`flex items-start gap-4 p-4 rounded-lg ${
                  notification.isUnread ? "bg-blue-50" : "bg-white"
                }`}
              >
                <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full">
                  {notification.isUnread ? (
                    <BellIcon className="w-6 h-6 text-blue-500" />
                  ) : (
                    <CheckCircleIcon className="w-6 h-6 text-green-500" />
                  )}
                </div>
                <div className="flex-grow">
                  <p
                    className={`text-sm text-gray-800 ${
                      notification.isUnread ? "font-bold" : ""
                    }`}
                  >
                    {notification.message}
                  </p>
                  <span className="text-xs text-gray-500">
                    {formatDate(notification.created_at)}
                  </span>
                </div>
                {notification.isUnread && (
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 translate-y-[-15px]" />
                )}
                <div className="relative">
                  <button
                    onClick={() => toggleMenu(notification.user_notif_id)}
                  >
                    <DotsHorizontalIcon className="w-5 h-5 text-gray-600 translate-y-[-8px]" />
                  </button>
                  {showMenu === notification.user_notif_id && (
                    <div className="absolute right-0 w-40 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                      <button
                        onClick={() => markAsRead(notification.user_notif_id)}
                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Mark as Read
                      </button>
                      <button
                        onClick={() =>
                          console.log(
                            "View notification",
                            notification.user_notif_id
                          )
                        }
                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        View
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
