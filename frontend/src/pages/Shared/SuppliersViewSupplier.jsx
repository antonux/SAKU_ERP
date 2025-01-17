import GoBackButton from "../../components/buttons/Backbutton";
import SupplierInputs from "../../components/Shared/suppliersViewSupplierInput";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { IoCamera } from "react-icons/io5";
import axios from "axios";
import { BiWindows } from "react-icons/bi";

const ViewSupplier = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isUpdate, setIsUpdate] = useState(false);
  const [isView, setIsView] = useState(true)
  const [preview, setPreview] = useState();
  const [supplierData, setSupplierData] = useState({});
  const { supplier } = location.state;
  const [initialData, setInitialData] = useState(supplier);


  useEffect(() => {
    if (location.pathname !== "/suppliers") {
      localStorage.setItem("lastSupplierPath", location.pathname);
    }
    if (supplier.image !== null) {
      setPreview(`http://localhost:4000${supplier.image}`)
    } else {
      setPreview(`/images/products/user.jpg`)
    }
  }, []);

  const handleGoBack = () => {
    localStorage.setItem("lastSupplierPath", "/suppliers");
    const lp = localStorage.getItem("lastSupplierPath")
    navigate(lp)
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setSupplierData({
        ...supplierData,
        image: file
      });
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
       // Fetch existing suppliers to check for duplicates
      const existingSuppliersResponse = await axios.get(
        "http://localhost:4000/api/supplier"
      );
      const existingSuppliers = existingSuppliersResponse.data;

      // Trim input fields
      const trimmedCompanyName = supplierData.company_name.trim().toLowerCase();
      const trimmedPhone = supplierData.phone.trim();
      const trimmedEmail = supplierData.email.trim().toLowerCase();

      // Check for duplicates based on trimmed values
      const isDuplicate = existingSuppliers.some(
        (supplier) =>
          (supplier.company_name.trim().toLowerCase() === trimmedCompanyName ||
            supplier.phone.trim() === trimmedPhone ||
            supplier.email.trim().toLowerCase() === trimmedEmail) &&
          supplier.supplier_id !== initialData.supplier_id
      );


      if (isDuplicate) {
        alert(
          "A supplier with the same company name, phone, or email already exists."
        );
        return; // Stop submission
      }
      const formData = new FormData();

      formData.append("supplier_id", supplierData.supplier_id);
      formData.append("company_name", supplierData.company_name.trim());
      formData.append("address", supplierData.address.trim());
      formData.append("contact_name", supplierData.contact_name.trim());
      formData.append("phone", supplierData.phone.trim());
      formData.append("email", supplierData.email.trim());
      formData.append("product_types",JSON.stringify(supplierData.product_types));

      if (supplierData.image) {
        formData.append('image', supplierData.image);
      }
      const response = await axios.post('http://localhost:4000/api/supplier/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const fetchNewData = await axios.get(`http://localhost:4000/api/supplier`);
      const newData = fetchNewData.data.find(supplier => supplier.supplier_id === supplierData.supplier_id);
      console.log('Supplier updated:', response.data);
      setInitialData(newData)
      setIsUpdate(false);
      setIsView(true);
    } catch (error) {
      console.error('Error creating supplier:', error);
    }
  };

  const deleteSupplier = async (supplier_id) => {
    try {
      const response = await axios.delete(`http://localhost:4000/api/supplier/delete/${supplier_id}`);
      console.log('Supplier deleted:', response.data);
      navigate("/suppliers")
    } catch (error) {
      console.error('Error deleting supplier:', error);
    }
  };

  const handleDeleteClick = (supplier_id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      deleteSupplier(supplier_id);
    }
  };


  return (
    <div className='flex flex-col gap-4 h-screen pb-5 pt-7'>
      <button onClick={handleGoBack} className="absolute z-50 translate-y-[3.2rem]">
        <GoBackButton />
      </button>
      <div className="flex flex-col pt-5 px-7 gap-10 mt-[6rem] w-full h-full shadow-md overflow-auto rounded-lg bg-white text-black scrollbar-thin">
        <h1 className="text-xl font-semibold text-[#272525]">{supplier.company_name}</h1>
        <form className="flex gap-5" onSubmit={handleSubmit}>
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
            <button 
            onClick={() => {handleDeleteClick(initialData.supplier_id)}}
            type="button"
            className="text-red-500 px-16 py-2 underline bottom-9 absolute">
              Delete Supplier
            </button>
          </div>
          <SupplierInputs
            isUpdate={isUpdate}
            setIsUpdate={setIsUpdate}
            isView={isView}
            setIsView={setIsView}
            viewSupplierData={initialData}
            Preview={setPreview}
            newSupplierData={setSupplierData}
          />
        </form>
      </div>
    </div>
  );
};

export default ViewSupplier;