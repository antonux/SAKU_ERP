
import Boxes from "../../components/Admin/inventoryBoxes";
import GoBackButton from "../../components/buttons/Backbutton";
import Input from "../../components/Admin/inventoryAddStockInput";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { IoCamera } from "react-icons/io5";

const AddStock = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isUpdate, setIsUpdate] = useState(false)
  const [inventoryFilter, setInventoryFilter] = useState("All");
  const [preview, setPreview] = useState("/images/products/tire.jpg");

  useEffect(() => {
    if (location.pathname !== "/admin/inventory") {
      localStorage.setItem("lastInventoryPath", location.pathname);
    }
  }, []);

  const handleGoBack = () => {
    localStorage.setItem("lastInventoryPath", "/admin/inventory");
    const lp = localStorage.getItem("lastInventoryPath")
    navigate(lp)
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };
  const inventoryFilterClass = (value) =>
    `px-4 font-normal rounded-full text-[#272525] ${inventoryFilter === value
      ? "border-[1px] border-black"
      : "border-[1px] border-transparent"
    } hover:border-gray-400 transition duration-200 ease-in-out`;



  return (
    <div className='flex flex-col gap-4 h-screen pb-5 pt-7'>
      <button onClick={handleGoBack} className="absolute z-50 translate-y-[3.2rem]">
        <GoBackButton />
      </button>
      <div className="flex flex-col pt-5 px-7 gap-10 mt-[6rem] w-full h-full shadow-md overflow-auto rounded-lg bg-white text-black scrollbar-thin">
        <div className="flex">
          <h1 className="flex whitespace-nowrap text-xl font-semibold text-[#272525]">Goodyear 155R12 <span className="text-gray-400 font-normal pl-2">#100083</span></h1>
          <div className="flex justify-end w-[75rem] text-sm gap-2 text-center items-center pr-12 cursor-pointer">
            <h1 className="font-normal text-[#272525] cursor-default">
              Location:
            </h1>
            <h1 className={inventoryFilterClass("All")}
              onClick={() => setInventoryFilter("All")}>
              All
            </h1>
            <h1 className={inventoryFilterClass("Store")}
              onClick={() => setInventoryFilter("Store")}>
              Store
            </h1>
            <h1 className={inventoryFilterClass("Warehouse")}
              onClick={() => setInventoryFilter("Warehouse")}>
              Warehouse
            </h1>
          </div>
        </div>
        <div className="flex gap-5">
          <div className="relative flex flex-col gap-5">
            {/* upload picture */}
            <div className="flex flex-col gap-12 items-center border-[2px] w-[19rem] border-[#f9f9f9] pt-10 pb-5 px-20">
              <div className={`flex flex-col relative items-center justify-center  bg-[#f2f2f2] rounded-lg size-44`}>
                <div className="flex flex-col">
                  {/* Label wraps the input for accessibility and interaction */}
                  <div>
                    <img
                      src={preview}
                      alt="Preview"
                      className="order-1 object-cover rounded-lg border border-gray-200 size-44"
                    />
                  </div>
                  <label className="cursor-pointer order-2 z-50">
                    <h1
                      className={`text-sm text-[#515150] hover:text-[#999999] text-center ${isUpdate ? "absolute pl-11 pt-2" : "hidden"
                        }`}
                    >
                      {isUpdate ? "Change Photo" : ""}
                    </h1>

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
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
              Delete product
            </button>
            {/* upload picture */}
          </div>
          <Input isUpdate={isUpdate} setIsUpdate={setIsUpdate} />
        </div>
      </div>
    </div>
  );
};

export default AddStock;
