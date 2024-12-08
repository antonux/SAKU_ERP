const Notifications = () => {
    const notifications = {
        today: [
            {
                id: 1,
                avatar: "/placeholder.svg?height=40&width=40",
                message: "Product (name) [tea] has reached it's re-order level",
                time: "10min ago",
                isUnread: true,
            },
            {
                id: 2,
                avatar: "/placeholder.svg?height=40&width=40",
                message: "Product (name) is already out of stock",
                time: "2h ago",
                isUnread: true,
            },
        ],
        yesterday: [
            {
                id: 3,
                avatar: "/placeholder.svg?height=40&width=40",
                message: "Sales staff created a product Request",
                time: "1day ago",
                isUnread: false,
            },
            {
                id: 4,
                avatar: "/placeholder.svg?height=40&width=40",
                message: "Warehouse staff created a procurement request",
                time: "1day ago",
                isUnread: false,
            },
        ],
    };

    return (
        <div className='flex flex-col mt-[6rem] gap-4 h-screen pb-5'>
            <div className="px-10 py-3 flex shrink-0 h-[5rem] justify-between items-center w-full shadow-md overflow-auto rounded-lg bg-white text-black scrollbar-thin">
                <h1 className='text-2xl font-semibold'>Notifications (3 unread)</h1>
                <button className="bg-[#7ad0ac] text-white px-16 py-3 rounded-full hover:bg-[#71c2a0] focus:outline-none focus:ring-2 focus:ring-green-50">
                    Add New Staff
                </button>
            </div>

            <div className="px-10 py-6 flex flex-col gap-6 flex-grow overflow-auto rounded-lg bg-white shadow-md">
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="font-medium">Today</h2>
                        <button className="text-sm text-gray-500 hover:text-gray-700">Select all</button>{/*ambut saun check box*/}
                    </div>
                    {notifications.today.map((notification) => (
                        <div
                            key={notification.id}
                            className={`flex items-start gap-4 p-4 rounded-lg ${notification.isUnread ? 'bg-blue-50' : 'bg-white'
                                }`}
                        >
                            <img
                                src={notification.avatar}
                                alt=""
                                className="w-10 h-10 rounded-full"
                            />
                            <div className="flex-grow">
                                <p className="text-sm text-gray-800">{notification.message}</p>
                                <span className="text-xs text-gray-500">{notification.time}</span>
                            </div>
                            {notification.isUnread && (
                                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                            )}
                            <button className="p-1 hover:bg-gray-100 rounded">
                                <svg
                                    className="w-5 h-5 text-gray-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                                    />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="font-medium">Yesterday 18th November, 2022</h2>
                        <button className="text-sm text-gray-500 hover:text-gray-700">Select all</button>
                    </div>
                    {notifications.yesterday.map((notification) => (
                        <div
                            key={notification.id}
                            className={`flex items-start gap-4 p-4 rounded-lg ${notification.isUnread ? 'bg-blue-50' : 'bg-white'
                                }`}
                        >
                            <img
                                src={notification.avatar}
                                alt=""
                                className="w-10 h-10 rounded-full"
                            />
                            <div className="flex-grow">
                                <p className="text-sm text-gray-800">{notification.message}</p>
                                <span className="text-xs text-gray-500">{notification.time}</span>
                            </div>
                            {notification.isUnread && (
                                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                            )}
                            <button className="p-1 hover:bg-gray-100 rounded">
                                <svg
                                    className="w-5 h-5 text-gray-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                                    />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Notifications;

