import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const AccountInputs = ({ accountInputData, isSubmitted }) => {
    const location = useLocation();
    const [isView, setIsView] = useState(true)
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        fname: '',
        lname: '',
        phone: '',
        gender: '',
        role: ''
    });
    const [isUpdate, setIsUpdate] = useState(false);

    useEffect(() => {
        if (location.pathname === "/accounts/add-account") {
            setIsView(false);
            setIsUpdate(false);
        }
    }, [location]);

    useEffect(() => {
        if (isSubmitted) {
            setFormData({
                username: '',
                password: '',
                email: '',
                fname: '',
                lname: '',
                phone: '',
                gender: '',
                role: ''
            });
        }
    }, [isSubmitted]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [id]: value
        }));
        accountInputData(prevData => ({
            ...prevData,
            [id]: value
        }));
    };

    return (
        <div className="w-[70rem] relative pb-[10rem] px-5 ">
            <div className="grid grid-cols-2 gap-7">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder="Enter username"
                        className="mt-1 block w-full px-3 py-4 text-center text-sm border border-gray-300 rounded-xl shadow-sm focus:outline-none"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter password"
                        className="mt-1 block w-full px-3 py-4 text-center text-sm border border-gray-300 rounded-xl shadow-sm focus:outline-none"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter email address"
                        className="mt-1 block w-full px-3 py-4 text-center text-sm border border-gray-300 rounded-xl shadow-sm focus:outline-none"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="fname" className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                        type="text"
                        id="fname"
                        value={formData.fname}
                        onChange={handleInputChange}
                        placeholder="Enter first name"
                        className="mt-1 block w-full px-3 py-4 text-center text-sm border border-gray-300 rounded-xl shadow-sm focus:outline-none"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="lname" className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                        type="text"
                        id="lname"
                        value={formData.lname}
                        onChange={handleInputChange}
                        placeholder="Enter last name"
                        className="mt-1 block w-full px-3 py-4 text-center text-sm border border-gray-300 rounded-xl shadow-sm focus:outline-none"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                        type="tel"
                        id="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+63"
                        pattern="0?9\d{9}"
                        className="mt-1 block w-full px-3 py-4 text-center text-sm border border-gray-300 rounded-xl shadow-sm focus:outline-none"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                    <select
                        id="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        onInvalid={(e) => e.target.setCustomValidity("Please select your gender")}
                        onInput={(e) => e.target.setCustomValidity("")} // Reset message when valid
                        required
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
                        value={formData.role}
                        onChange={handleInputChange}
                        onInvalid={(e) => e.target.setCustomValidity("Please select your role")}
                        onInput={(e) => e.target.setCustomValidity("")} // Reset message when valid
                        required
                        className="mt-1 block w-full px-3 py-4 text-center text-sm border border-gray-300 rounded-xl shadow-sm focus:outline-none"
                    >
                        <option value="">Select role</option>
                        <option value="store">Store Staff</option>
                        <option value="warehouse">Warehouse Staff</option>
                        <option value="manager">Manager</option>
                    </select>
                </div>
            </div>
        </div>
    )
}

export default AccountInputs;

