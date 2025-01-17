import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const Accounts = () => {
    const [accountData, setAccountData] = useState([]);

    useEffect(() => {
        const fetchAccountData = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/users');
                setAccountData(response.data);
            } catch (err) {
                console.error('Error fetching account data:', err);
            }
        };
        fetchAccountData();
    }, []);

    return (
        <div className='flex flex-col gap-4 h-screen pb-5'>
            <div className="px-10 py-6 mt-[6rem] flex flex-col md:flex-row gap-4 flex-shrink-0 w-full shadow-md rounded-lg bg-white text-black">
                <div className="flex-1 space-y-2">
                    <h2 className="text-sm font-medium">Quick search an account</h2>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Enter search word"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7ad0ac]"
                        />
                        <button className="absolute right-3 top-1/2 -translate-y-1/2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-center">
                        <p className="text-3xl font-semibold">{accountData.length}</p>
                        <p className="text-sm text-gray-500">Total number of accounts</p>
                    </div>

                    <div className="relative">
                        <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7ad0ac] appearance-none bg-white pr-8">
                            <option>All accounts</option>
                            <option>Store Staff</option>
                            <option>Warehouse Staff</option>
                        </select>
                        <svg className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                    <Link to="/accounts/add-account">
                        <button className="bg-[#7ad0ac] text-white px-6 py-2 rounded-full hover:bg-[#71c2a0] focus:outline-none focus:ring-2 focus:ring-green-50">
                            Add New Account
                        </button>
                    </Link>
                </div>
            </div>
            <div className="rounded-lg shadow-md overflow-auto scrollbar-thin">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className='sticky top-0'>
                        <tr>
                            <th colSpan="9" className="px-6 py-3 bg-white text-lg font-medium text-[#080d1c] text-start">
                                All Accounts
                            </th>
                        </tr>
                        <tr className="text-xs text-gray-700 uppercase bg-white">
                            <th scope="col" className="px-6 py-3">SN</th>
                            <th scope="col" className="px-6 py-3">First Name</th>
                            <th scope="col" className="px-6 py-3">Last Name</th>
                            <th scope="col" className="px-6 py-3">Gender</th>
                            <th scope="col" className="px-6 py-3">Email</th>
                            <th scope="col" className="px-6 py-3">Phone Number</th>
                            <th scope="col" className="px-6 py-3">Role</th>
                            <th scope="col" className="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accountData
                            .filter(account => account.role !== "admin") // Filter out accounts with role "admin"
                            .map((account, index) => (
                                <tr
                                    key={account.user_id}
                                    className="bg-white border-b hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4">{index + 1}</td>
                                    <td className="px-6 py-4">{account.fname}</td>
                                    <td className="px-6 py-4">{account.lname}</td>
                                    <td className="px-6 py-4">{account.gender}</td>
                                    <td className="px-6 py-4">{account.email}</td>
                                    <td className="px-6 py-4">{account.phone}</td>
                                    <td className="px-6 py-4">{account.role}</td>
                                    <td className="px-6 py-4">
                                        <Link
                                            to="/accounts/view-account"
                                            state={{ account }}
                                        >
                                            <button className="text-blue-500 hover:underline">
                                                View more
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}

                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Accounts;

