import GoBackButton from "../../components/buttons/Backbutton";
import AccountInputs from "../../components/Admin/accountsAddAccountInput";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { IoCamera } from "react-icons/io5";

const ViewAccount = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isUpdate, setIsUpdate] = useState(false);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (location.pathname !== "/accounts") {
            localStorage.setItem("lastAccountPath", location.pathname);
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
        }
    };

    return (
        <div className='flex flex-col gap-4 h-screen pb-5 pt-7'>
            <button onClick={handleGoBack} className="absolute z-50 translate-y-[3.2rem]">
                <GoBackButton />
            </button>
            <div className="flex flex-col pt-5 px-7 gap-10 mt-[6rem] w-full h-full shadow-md overflow-auto rounded-lg bg-white text-black scrollbar-thin">
                <h1 className="text-xl font-semibold text-[#272525]">John Otto</h1>
                <div className="flex gap-5">
                    <div className="relative flex flex-col gap-5">
                        {/* upload picture */}
                        <div className="flex flex-col gap-12 items-center border-[2px] w-[19rem] border-[#f9f9f9] pt-10 pb-5 px-20">
                            <div className={`flex flex-col relative items-center justify-center bg-[#f2f2f2] rounded-lg size-44`}>
                                {!preview && <div className="border-[1px] border-[#dfdfdf] border-dashed size-48 absolute rounded-lg z-0"></div>}
                                {!preview && <IoCamera className="text-xl text-[#a2a2a2]" />}
                                <div className="flex flex-col">
                                    {preview && (
                                        <div>
                                            <img
                                                src={preview}
                                                alt="Preview"
                                                className="order-1 object-cover rounded-lg border border-gray-200 size-44"
                                            />
                                        </div>
                                    )}
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
                        <button className="text-red-500 px-16 py-2 underline bottom-9 absolute">
                            Delete Account
                        </button>
                    </div>
                    <AccountInputs
                        isUpdate={isUpdate}
                        setIsUpdate={setIsUpdate}
                    />
                </div>
            </div>
        </div>
    );
};

export default ViewAccount;