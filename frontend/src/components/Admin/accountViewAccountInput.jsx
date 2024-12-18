import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";


const AccountInputs = ({ isUpdate, setIsUpdate, viewAccountData, Preview, newAccountData, setIsView, isView }) => {
    const initAccountData = {
        username: '',
        email: '',
        fname: '',
        lname: '',
        phone: '',
        gender: '',
        role: '',
        image: null,
    }
    const [accountData, setAccountData] = useState(initAccountData);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAccountData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    useEffect(() => {
        newAccountData(accountData);
    }, [accountData, newAccountData]);

    useEffect(() => {
        setAccountData(viewAccountData);
    }, [viewAccountData]);

    return (
        <div className="w-[70rem] relative pb-[15rem] px-5 ">
            <div className="grid grid-cols-2 gap-7">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={accountData.username}
                        disabled={isView}
                        onChange={handleInputChange}
                        placeholder="Enter username"
                        className={`${isView ? "text-gray-400 cursor-default" : ""} mt-1 block w-full px-3 py-4 text-center text-sm border border-gray-300 rounded-xl shadow-sm focus:outline-none`}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={accountData.email}
                        disabled={isView}
                        onChange={handleInputChange}
                        placeholder="Enter email"
                        className={`${isView ? "text-gray-400 cursor-default" : ""} mt-1 block w-full px-3 py-4 text-center text-sm border border-gray-300 rounded-xl shadow-sm focus:outline-none`}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="fname" className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                        type="text"
                        id="fname"
                        name="fname"
                        value={accountData.fname}
                        disabled={isView}
                        onChange={handleInputChange}
                        placeholder="Enter first name"
                        className={`${isView ? "text-gray-400 cursor-default" : ""} mt-1 block w-full px-3 py-4 text-center text-sm border border-gray-300 rounded-xl shadow-sm focus:outline-none`}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="lname" className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                        type="text"
                        id="lname"
                        name="lname"
                        value={accountData.lname}
                        disabled={isView}
                        onChange={handleInputChange}
                        placeholder="Enter last name"
                        className={`${isView ? "text-gray-400 cursor-default" : ""} mt-1 block w-full px-3 py-4 text-center text-sm border border-gray-300 rounded-xl shadow-sm focus:outline-none`}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={accountData.phone}
                        disabled={isView}
                        onChange={handleInputChange}
                        placeholder="+63"
                        pattern="0?9\d{9}"
                        className={`${isView ? "text-gray-400 cursor-default" : ""} mt-1 block w-full px-3 py-4 text-center text-sm border border-gray-300 rounded-xl shadow-sm focus:outline-none`}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                    <select
                        id="gender"
                        name="gender"
                        value={accountData.gender}
                        disabled={isView}
                        onChange={handleInputChange}
                        className={`${isView ? "text-gray-400 cursor-default" : ""} mt-1 block w-full px-3 py-4 text-center text-sm border border-gray-300 rounded-xl shadow-sm focus:outline-none`}
                        onInvalid={(e) => e.target.setCustomValidity("Please select your gender")}
                        onInput={(e) => e.target.setCustomValidity("")} // Reset message when valid
                        required
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
                        name="role"
                        value={accountData.role}
                        disabled={isView}
                        onChange={handleInputChange}
                        className={`${isView ? "text-gray-400 cursor-default" : ""} mt-1 block w-full px-3 py-4 text-center text-sm border border-gray-300 rounded-xl shadow-sm focus:outline-none`}
                        onInvalid={(e) => e.target.setCustomValidity("Please select your role")}
                        onInput={(e) => e.target.setCustomValidity("")} // Reset message when valid
                        required
                    >
                        <option value="">Select role</option>
                        <option value="store">Store Staff</option>
                        <option value="warehouse">Warehouse Staff</option>
                        <option value="manager">Manager</option>
                    </select>
                </div>
            </div>
            {isView &&
                <button onClick={() => (setIsUpdate(true), setIsView(false))}
                    className="absolute bottom-10 right-10 bg-[#7ad0ac] text-white px-16 py-3 rounded-xl hover:bg-[#71c2a0] focus:outline-none focus:ring-2 focus:ring-green-50">
                    Update
                </button>
            }
            <div className="flex absolute gap-5 bottom-10 right-10">
                {isUpdate &&
                    <button
                        onClick={() => { setIsUpdate(false); setIsView(true); setAccountData(viewAccountData); Preview(viewAccountData.image ? `http://localhost:4000${viewAccountData.image}` : `/images/products/user.jpg`) }}
                        className="bottom-10 right-10 bg-red-500 text-white px-16 py-3 rounded-xl hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-green-50">
                        Cancel
                    </button>
                }
                {isUpdate &&
                    <button
                        type="submit"
                        className="bottom-10 right-10 bg-[#7ad0ac] text-white px-16 py-3 rounded-xl hover:bg-[#6ab696] focus:outline-none focus:ring-2 focus:ring-green-50">
                        Save
                    </button>
                }
            </div>
        </div>
    )
}

export default AccountInputs;

