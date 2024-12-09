import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const SupplierInputs = ({ isUpdate, setIsUpdate }) => {
    const location = useLocation();
    const [isView, setIsView] = useState(true)
    useEffect(() => {
        if (location.pathname == "/suppliers/add-supplier") {
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
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
                    <input
                        type="text"
                        id="companyName"
                        placeholder="Enter company name"
                        className="mt-1 block w-full px-3 py-4 text-center text-sm border border-gray-300 rounded-xl shadow-sm  focus:outline-none"
                    />
                </div>
                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                    <input
                        type="text"
                        id="address"
                        placeholder="Enter company address"
                        className="mt-1 block w-full px-3 py-4 text-center text-sm border border-gray-300 rounded-xl shadow-sm focus:outline-none"
                    />
                </div>

                {/* Row 2 */}
                <div>
                    <label htmlFor="contactName" className="block text-sm font-medium text-gray-700">Contact Name</label>
                    <input
                        type="text"
                        id="contactName"
                        placeholder="Enter contact name"
                        className="mt-1 block w-full px-3 py-4 text-center text-sm border border-gray-300 rounded-xl shadow-sm focus:outline-none"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter email"
                        className="mt-1 block w-full px-3 py-4 text-center text-sm border border-gray-300 rounded-xl shadow-sm focus:outline-none"
                    />
                </div>

                {/* Row 3 */}
                <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                        type="tel"
                        id="phoneNumber"
                        placeholder="Enter phone number"
                        className="mt-1 block w-full px-3 py-4 text-center text-sm border border-gray-300 rounded-xl shadow-sm focus:outline-none"
                    />
                </div>

                <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Offered</label>
                    <div className="space-y-2">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="category"
                                value="tire"
                                className="form-checkbox h-4 w-4 text-[#7ad0ac]"
                            />
                            <span className="text-sm text-gray-700">Tire</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="category"
                                value="oil"
                                className="form-checkbox h-4 w-4 text-[#7ad0ac]"
                            />
                            <span className="text-sm text-gray-700">Oil</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="category"
                                value="battery"
                                className="form-checkbox h-4 w-4 text-[#7ad0ac]"
                            />
                            <span className="text-sm text-gray-700">Battery</span>
                        </label>
                    </div>
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

export default SupplierInputs;

