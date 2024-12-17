import GoBackButton from "../../components/buttons/Backbutton";
import AccountInputs from "../../components/Admin/accountViewAccountInput";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { IoCamera } from "react-icons/io5";
import axios from "axios";

const ViewAccount = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isUpdate, setIsUpdate] = useState(false);
    const [isView, setIsView] = useState(true);
    const [preview, setPreview] = useState(null);
    const [accountData, setAccountData] = useState({});
    const { account } = location.state;
    const [initialData, setInitialData] = useState(account);

    useEffect(() => {
        if (location.pathname !== "/accounts") {
            localStorage.setItem("lastAccountPath", location.pathname);
        }
        if (account.image !== null) {
            setPreview(`http://localhost:4000${account.image}`)
        } else {
            setPreview(`/images/products/user.jpg`)
        }
    }, []);

    const handleGoBack = () => {
        localStorage.setItem("lastAccountPath", "/accounts");
        const lp = localStorage.getItem("lastAccountPath")
        navigate(lp)
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            setAccountData({
                ...accountData,
                image: file
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();

            formData.append('user_id', accountData.user_id);
            formData.append('username', accountData.username);
            formData.append('email', accountData.email);
            formData.append('fname', accountData.fname);
            formData.append('lname', accountData.lname);
            formData.append('phone', accountData.phone);
            formData.append('gender', accountData.gender);
            formData.append('role', accountData.role);

            if (accountData.image) {
                formData.append('image', accountData.image);
            }

            const response = await axios.post('http://localhost:4000/api/users/update', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const fetchNewData = await axios.get(`http://localhost:4000/api/users`);
            const newData = fetchNewData.data.find(user => user.user_id === accountData.user_id);
            console.log('Account updated:', response.data);
            setInitialData(newData)
            setIsUpdate(false);
            setIsView(true);
        } catch (error) {
            console.error('Error updating account:', error);
        }
    };

    const deleteAccount = async (user_id) => {
        try {
            const response = await axios.delete(`http://localhost:4000/api/users/delete/${user_id}`);
            console.log('Account deleted:', response.data);
            navigate("/accounts")
        } catch (error) {
            console.error('Error deleting account:', error);
        }
    };

    const handleDeleteClick = (user_id) => {
        if (window.confirm('Are you sure you want to delete this account?')) {
            deleteAccount(user_id);
        }
    };

    return (
        <div className='flex flex-col gap-4 h-screen pb-5 pt-7'>
            <button onClick={handleGoBack} className="absolute z-50 translate-y-[3.2rem]">
                <GoBackButton />
            </button>
            <div className="flex flex-col pt-5 px-7 gap-10 mt-[6rem] w-full h-full shadow-md overflow-auto rounded-lg bg-white text-black scrollbar-thin">
                <h1 className="text-xl font-semibold text-[#272525]">{`${initialData.fname} ${initialData.lname}`}</h1>
                <form className="flex gap-5" onSubmit={handleSubmit}>
                    <div className="relative flex flex-col gap-5">
                        <div className="flex flex-col gap-12 items-center border-[2px] w-[19rem] border-[#f9f9f9] pt-10 pb-5 px-20">
                            <div className={`flex flex-col relative items-center justify-center bg-[#f2f2f2] rounded-lg size-44`}>
                                <div className="flex flex-col">
                                    <div>
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            className="order-1 object-cover rounded-lg border border-gray-200 size-44"
                                        />
                                    </div>
                                    <label className="cursor-pointer order-2 z-50">
                                        <h1
                                            className={`text-sm text-[#515150] hover:text-[#999999] text-center ${isUpdate ? "absolute pl-11 pt-2" : "hidden"}`}
                                        >
                                            {isUpdate ? "Change Photo" : ""}
                                        </h1>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleFileChange}
                                            disabled={!isUpdate}
                                        />
                                    </label>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 text-center text-[#272525]">
                                <div className="flex flex-col gap-1">
                                    <h1 className="text-sm text-[#888888]">Allowed format</h1>
                                    <h1 className="text-sm">JPG, JPEG, and PNG</h1>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <h1 className="text-sm text-[#888888]">Max file size</h1>
                                    <h1 className="text-sm">2mb</h1>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => { handleDeleteClick(initialData.user_id) }}
                            className="text-red-500 px-16 py-2 underline bottom-9 absolute">
                            Delete Account
                        </button>
                    </div>
                    <AccountInputs
                        isUpdate={isUpdate}
                        setIsUpdate={setIsUpdate}
                        viewAccountData={initialData}
                        Preview={setPreview}
                        newAccountData={setAccountData}
                        isView={isView}
                        setIsView={setIsView}
                    />
                </form>
            </div>
        </div>
    );
};

export default ViewAccount;

