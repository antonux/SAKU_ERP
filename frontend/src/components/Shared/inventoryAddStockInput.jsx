import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import TagInput from "./tagInputs";

const AddStockInput = ({ isUpdate, setIsUpdate }) => {
  const location = useLocation();
  const [selectedSupplier, setSelectedSupplier] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [isView, setIsView] = useState(true)

  useEffect(() => {
    if (location.pathname == "/inventory/add-stock") {
      setIsView(false);
    }
  }, []);

  useEffect(() => {
    if (isUpdate) {
      setIsView(false);
    }
  }, [isUpdate]);

  const handleSupplierChange = (event) => {
    const selectedValue = event.target.value;
    if (selectedValue && !selectedSupplier.includes(selectedValue)) {
      setSelectedSupplier([...selectedSupplier, selectedValue]); // Add selected supplier to the list
      setSelectedOption("");
    }
  };

  return (
    <div className="w-[70rem] relative pb-[10rem] px-5 ">
      <div className="grid grid-cols-2 gap-7">
        {/* Row 1 */}
        <div>
          <label htmlFor="productName" className="block text-sm font-medium text-gray-700">Product Name</label>
          <input
            type="text"
            id="productName"
            placeholder="Enter product name"
            className="mt-1 block w-full px-3 py-4 text-center text-sm border border-gray-300 rounded-xl shadow-sm  focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="productSize" className="block text-sm font-medium text-gray-700">Product Size/Model</label>
          <input
            type="text"
            id="productSize"
            placeholder="Enter Size/Model"
            className="mt-1 block w-full px-3 py-4 text-center text-sm border border-gray-300 rounded-xl shadow-sm focus:outline-none"
          />
        </div>

        {/* Row 2 */}
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
          <input
            type="number"
            id="quantity"
            min="0"
            placeholder="Enter Quantity"
            className="mt0 block w-full px-3 py-4 text-center text-sm border border-gray-300 rounded-xl shadow-sm focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="reorderLevel" className="block text-sm font-medium text-gray-700">Reorder Level</label>
          <input
            type="number"
            id="reorderLevel"
            min="0"
            placeholder="Enter reorder level"
            className="mt-1 block w-full px-3 py-4 text-center text-sm border border-gray-300 rounded-xl shadow-sm focus:outline-none"
          />
        </div>

        {/* Row 3 */}
        <div>
          <label htmlFor="unitPrice" className="block text-sm font-medium text-gray-700">Unit Price</label>
          <input
            type="number"
            id="unitPrice"
            placeholder="Enter amount"
            min="0"
            className="mt-1 block w-full px-3 py-4 text-center text-sm border border-gray-300 rounded-xl shadow-sm focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-700">Total Amount</label>
          <input
            type="text"
            id="totalAmount"
            readOnly
            placeholder="Auto-calculated"
            className="mt-1 block w-full px-3 py-4 text-center text-sm border border-gray-300 rounded-xl shadow-sm focus:outline-none"
          />
        </div>

        {/* Row 4 */}
            <div>
      <label htmlFor="supplier" className="block text-sm font-medium text-gray-700">
        Suppliers
      </label>

      {/* Tag Input component */}
      <TagInput
        tags={selectedSupplier}
        setTags={setSelectedSupplier}
      />

      {/* Supplier Select dropdown */}
      <select
        id="supplier"
        className="mt-1 block w-full px-3 py-4 text-center text-sm border border-gray-300 rounded-xl shadow-sm focus:outline-none"
        onChange={handleSupplierChange}
        value={selectedOption}
      >
        <option value="">Select a supplier</option>
        {/* Dynamically disable options that have already been selected */}
        <option value="John Bravo" disabled={selectedSupplier.includes("John Bravo")}>
          John Bravo
        </option>
        <option value="Sink Delinko" disabled={selectedSupplier.includes("Sink Delinko")}>
          Sink Delinko
        </option>
        <option value="Mainteno" disabled={selectedSupplier.includes("Mainteno")}>
          Mainteno
        </option>
        {/* Add more supplier options here with dynamic values and disable accordingly */}
      </select>
    </div>
        <div className="relative">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <select
            id="category"
            className="mt-1 block w-full px-3 py-4 text-center text-sm border border-gray-300 rounded-xl shadow-sm focus:outline-none"
          >
            <option value="">Choose category</option>
            <option value="category1">Tire</option>
            <option value="category2">Oil</option>
            <option value="category3">Battery</option>
          </select>
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
          <button onClick={() =>{ setIsUpdate(false); setIsView(true)}}
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

export default AddStockInput;