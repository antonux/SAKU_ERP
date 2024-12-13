import GoBackButton from "../../components/buttons/Backbutton";
import SupplierInputs from "../../components/Shared/suppliersAddSupplierInput";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { IoCamera } from "react-icons/io5";
import axios from "axios";

const AddSupplier = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [preview, setPreview] = useState(null);
  const [supplierData, setSupplierData] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (location.pathname !== "/suppliers") {
      localStorage.setItem("lastSupplierPath", location.pathname);
    }
  }, [location]);

  const handleGoBack = () => {
    localStorage.setItem("lastSupplierPath", "/suppliers");
    const lp = localStorage.getItem("lastSupplierPath")
    navigate(lp)
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
     e.preventDefault(); 
    try {
      // Step 3: Send POST request with the form data
      const response = await axios.post('http://localhost:4000/api/supplier/create', supplierData);
      console.log('Supplier Created:', response.data);
      setIsSubmitted(true);
      // Optionally, clear the form or handle a successful submission
    } catch (error) {
      console.error('Error creating supplier:', error);
    }
  };

  return (
    <div className='flex flex-col gap-4 h-screen pb-5 pt-7'>
      <button onClick={handleGoBack} className="absolute z-50 translate-y-[3.2rem]">
        <GoBackButton />
      </button>
      <div className="flex flex-col pt-5 px-7 gap-10 mt-[6rem] w-full h-full shadow-md overflow-auto rounded-lg bg-white text-black scrollbar-thin">
        <h1 className="text-xl font-semibold text-[#272525]">Add a New Supplier</h1>
        <form className="flex gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-5">
            {/* upload picture */}
            <div className="flex flex-col gap-12 items-center border-[2px] w-[19rem] border-[#f9f9f9] pt-10 pb-5 px-20">
              <div className={`flex flex-col relative items-center justify-center  bg-[#f2f2f2] rounded-lg  ${preview ? "size-44" : "size-40"}`}>
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
                      className={`text-sm text-[#515150] hover:text-[#999999] text-center ${preview ? "absolute pl-11 pt-2" : ""
                        }`}
                    >
                      {preview ? "Change Photo" : "Upload Photo"}
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
            <button
              type="submit"
              className="bg-[#7ad0ac] text-white px-16 py-3 rounded-xl hover:bg-[#71c2a0] focus:outline-none focus:ring-2 focus:ring-green-50">
              Add Supplier
            </button>
            {/* upload picture */}
          </div>
          <SupplierInputs supplierInputData={setSupplierData} isSubmitted={isSubmitted} />
        </form>
      </div>
    </div>
  );
};

export default AddSupplier;

