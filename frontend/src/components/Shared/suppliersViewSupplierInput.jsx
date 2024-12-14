import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const SupplierInputs = ({ isUpdate, setIsUpdate, isSubmitted, viewSupplierData, Preview, newSupplierData, setIsView, isView }) => {
  const location = useLocation();
  const initSupplierData = {
    company_name: '',
    address: '',
    contact_name: '',
    phone: '',
    email: '',
    image: null,
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
    newSupplierData(supplierData);
  }, [supplierData, newSupplierData]);

  useEffect(() => {
    setSupplierData(viewSupplierData);
  }, [viewSupplierData]);

  return (
    <div className="w-[70rem] relative pb-[15rem] px-5 ">
      <div className="grid grid-cols-2 gap-7">
        {/* Row 1 */}
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
          <input
            type="text"
            id="companyName"
            name="company_name"
            value={supplierData.company_name}
            disabled={isView ? true : false}
            onChange={handleInputChange}
            placeholder="Enter company name"
            className={`${isView ? "text-gray-400 cursor-default" : ""} mt-1 block w-full px-3 py-4 text-center text-sm border border-gray-300 rounded-xl shadow-sm  focus:outline-none `}
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
            disabled={isView ? true : false}
            onChange={handleInputChange}
            placeholder="Enter company address"
            className={`${isView ? "text-gray-400 cursor-default" : ""} mt-1 block w-full px-3 py-4 text-center text-sm border border-gray-300 rounded-xl shadow-sm  focus:outline-none `}
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
            disabled={isView ? true : false}
            onChange={handleInputChange}
            placeholder="Enter contact name"
            className={`${isView ? "text-gray-400 cursor-default" : ""} mt-1 block w-full px-3 py-4 text-center text-sm border border-gray-300 rounded-xl shadow-sm  focus:outline-none `}
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
            disabled={isView ? true : false}
            onChange={handleInputChange}
            placeholder="Enter email"
            className={`${isView ? "text-gray-400 cursor-default" : ""} mt-1 block w-full px-3 py-4 text-center text-sm border border-gray-300 rounded-xl shadow-sm  focus:outline-none `}
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
            disabled={isView ? true : false}
            onChange={handleInputChange}
            placeholder="+63"
            pattern="0?9\d{9}"
            className={`${isView ? "text-gray-400 cursor-default" : ""} mt-1 block w-full px-3 py-4 text-center text-sm border border-gray-300 rounded-xl shadow-sm  focus:outline-none `}
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
                value="tire"
                checked={supplierData.product_types.includes("tire")}
                onChange={handleCheckboxChange}
                className="form-checkbox h-4 w-4 text-[#7ad0ac]"
                required={supplierData.product_types.length === 0}
                onInvalid={(e) => e.target.setCustomValidity('Please select at least 1 product offered')}
                onInput={(e) => e.target.setCustomValidity('')}
                disabled={isView ? true : false}
              />
              <span className="text-sm text-gray-700">Tire</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="category"
                value="oil"
                checked={supplierData.product_types.includes("oil")}
                onChange={handleCheckboxChange}
                className="form-checkbox h-4 w-4 text-[#7ad0ac]"
                disabled={isView ? true : false}
              />
              <span className="text-sm text-gray-700">Oil</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="category"
                value="battery"
                checked={supplierData.product_types.includes("battery")}
                onChange={handleCheckboxChange} // Handle change event
                className="form-checkbox h-4 w-4 text-[#7ad0ac]"
                disabled={isView ? true : false}
              />
              <span className="text-sm text-gray-700">Battery</span>
            </label>
          </div>
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
            onClick={() => { setIsUpdate(false); setIsView(true); setSupplierData(viewSupplierData); Preview(viewSupplierData.image ? `http://localhost:4000${viewSupplierData.image}` : `/images/products/user.jpg`) }}
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

export default SupplierInputs;

