import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const AccountInputs = ({ isUpdate, setIsUpdate }) => {
    const location = useLocation();
    const [isView, setIsView] = useState(true)
    useEffect(() => {
        if (location.pathname == "/accounts/add-account") {
            setIsView(false);
        }
    }, []);

    useEffect(() => {
        if (isUpdate) {
            setIsView(false);
        }
    }, [isUpdate]);

    return (
        <div className="w-[70rem] relative pb-[10rem] px-5 ">
            <div className="grid grid-cols-2 gap-7">
                {/* Row 1 */}
                <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                        type="text"
                        id="firstName"
                        placeholder="Enter first name"
                        className="mt-1 block w-full px-3 py-4 text-center text-sm border border-gray-300 rounded-xl shadow-sm  focus:outline-none"
                    />
                </div>
                <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                        type="text"
                        id="lastName"
                        placeholder="Enter last name"
                        className="mt-1 block w-full px-3 py-4 text-center text-sm border border-gray-300 rounded-xl shadow-sm focus:outline-none"
                    />
                </div>

                {/* Row 2 */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter email address"
                        className="mt-1 block w-full px-3 py-4 text-center text-sm border border-gray-300 rounded-xl shadow-sm focus:outline-none"
                    />
                </div>
                <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                        type="tel"
                        id="phoneNumber"
                        placeholder="Enter phone number"
                        className="mt-1 block w-full px-3 py-4 text-center text-sm border border-gray-300 rounded-xl shadow-sm focus:outline-none"
                    />
                </div>

                {/* Row 3 */}
                <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                    <select
                        id="gender"
                        className="mt-1 block w-full px-3 py-4 text-center text-sm border border-gray-300 rounded-xl shadow-sm focus:outline-none"
                    >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                    <select
                        id="role"
                        className="mt-1 block w-full px-3 py-4 text-center text-sm border border-gray-300 rounded-xl shadow-sm focus:outline-none"
                    >
                        <option value="">Select role</option>
                        <option value="sales">Store Staff</option>
                        <option value="warehouse">Warehouse Staff</option>
                        <option value="manager">Manager</option>
                    </select>
                </div>

                {/* Row 4 */}
                <div className="col-span-2">
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
                    <select
                        id="department"
                        className="mt-1 block w-full px-3 py-4 text-center text-sm border border-gray-300 rounded-xl shadow-sm focus:outline-none"
                    >
                        <option value="">Select department</option>
                        <option value="sales">Store Department</option>
                        <option value="warehouse">Warehouse Department</option>
                        <option value="management">Management</option>
                    </select>
                </div>
            </div>
            {isView &&
                <button onClick={() => setIsUpdate(true)}
                    className="absolute bottom-10 right-10 bg-[#7ad0ac] text-white px-16 py-3 rounded-xl hover:bg-[#71c2a0] focus:outline-none focus:ring-2 focus:ring-green-50">
                    Update
                </button>
            }
            <div className="flex absolute gap-5 bottom-10 right-10">
                {isUpdate &&
                    <button onClick={() => { setIsUpdate(false); setIsView(true) }}
                        className="bottom-10 right-10 bg-red-500 text-white px-16 py-3 rounded-xl hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-green-50">
                        Cancel
                    </button>
                }
                {isUpdate &&
                    <button onClick={() => console.log(alert("Saved"))}
                        className="bottom-10 right-10 bg-[#7ad0ac] text-white px-16 py-3 rounded-xl hover:bg-[#6ab696] focus:outline-none focus:ring-2 focus:ring-green-50">
                        Save
                    </button>
                }
            </div>
        </div>
    )
}

export default AccountInputs;

