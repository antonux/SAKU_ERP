import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const SupplierInputs = ({ isUpdate, setIsUpdate, supplierInputData, isSubmitted }) => {
  const location = useLocation();
  const [isView, setIsView] = useState(true)
  const initSupplierData = {
    company_name: '',
    address: '',
    contact_name: '',
    phone: '',
    email: '',
    product_types: [],
  }
  const [supplierData, setSupplierData] = useState(initSupplierData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSupplierData((prevData) => ({
      ...prevData,
      [name]: value, // Update the corresponding field in the state
    }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;

    setSupplierData((prevData) => {
      const updatedProductTypes = checked
        ? [...prevData.product_types, value] // Add product type if checked
        : prevData.product_types.filter((type) => type !== value); // Remove product type if unchecked

      // Use the updated state here
      const updatedData = {
        ...prevData,
        product_types: updatedProductTypes,
      };
      return updatedData;
    });
  };

  useEffect(() => {
    supplierInputData(supplierData);
  }, [supplierData]);

  useEffect(() => {
    setSupplierData(initSupplierData);
  }, [isSubmitted]);

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
            name="company_name"
            value={supplierData.company_name}
            onChange={handleInputChange}
            placeholder="Enter company name"
            className="mt-1 block w-full px-3 py-4 text-center text-sm border border-gray-300 rounded-xl shadow-sm  focus:outline-none"
            required
          />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={supplierData.address}
            onChange={handleInputChange}
            placeholder="Enter company address"
            className="mt-1 block w-full px-3 py-4 text-center text-sm border border-gray-300 rounded-xl shadow-sm focus:outline-none"
            required
          />
        </div>

        {/* Row 2 */}
        <div>
          <label htmlFor="contactName" className="block text-sm font-medium text-gray-700">Contact Name</label>
          <input
            type="text"
            id="contactName"
            name="contact_name"
            value={supplierData.contact_name}
            onChange={handleInputChange}
            placeholder="Enter contact name"
            className="mt-1 block w-full px-3 py-4 text-center text-sm border border-gray-300 rounded-xl shadow-sm focus:outline-none"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={supplierData.email}
            onChange={handleInputChange}
            placeholder="Enter email"
            className="mt-1 block w-full px-3 py-4 text-center text-sm border border-gray-300 rounded-xl shadow-sm focus:outline-none"
            required
          />
        </div>

        {/* Row 3 */}
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phone"
            value={supplierData.phone}
            onChange={handleInputChange}
            placeholder="+63"
            pattern="0?9\d{9}"
            className="mt-1 block w-full px-3 py-4 text-center text-sm border border-gray-300 rounded-xl shadow-sm focus:outline-none"
            required
          />
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">Product Offered</label>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="category"
                value="100"
                checked={supplierData.product_types.includes("100")} // Check if this product type is selected
                onChange={handleCheckboxChange} // Handle change event
                className="form-checkbox h-4 w-4 text-[#7ad0ac]"
                required={supplierData.product_types.length === 0}
              />
              <span className="text-sm text-gray-700">Tire</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="category"
                value="101"
                checked={supplierData.product_types.includes("101")} // Check if this product type is selected
                onChange={handleCheckboxChange} // Handle change event
                className="form-checkbox h-4 w-4 text-[#7ad0ac]"
              />
              <span className="text-sm text-gray-700">Oil</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="category"
                value="102"
                checked={supplierData.product_types.includes("102")} // Check if this product type is selected
                onChange={handleCheckboxChange} // Handle change event
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

