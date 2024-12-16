import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import TagInput from "./tagInputs";
import axios from "axios";

const AddStockInput = ({ isUpdate, setIsUpdate, productInputData, isSubmitted }) => {
  const location = useLocation();
  const [selectedSupplier, setSelectedSupplier] = useState([]);
  const [initialSupplierData, setInitialSupplierData] = useState([]);
  const [supplierData, setSupplierData] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [isView, setIsView] = useState(true)
  const initProductData = {
    name: '',
    type: '',
    image: null,
    size: '',
    unit_price: '',
    reorder_level: '',
    location_quantity: [
      { location: 'store', quantity: '' },
      { location: 'warehouse', quantity: '' },
    ],
    product_supplier: [
    ],
  };
  const [productData, setProductData] = useState(initProductData);
  console.log(productData)
  // console.log(supplierData)

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    if (name === "reorder_level" || name === "unit_price") {
      value = parseInt(e.target.value, 10);
    }
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLocationQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);

    setProductData((prevData) => {
      const updatedLocationQuantity = prevData.location_quantity.map((entry) => {
        if (entry.location === "warehouse") {
          return { ...entry, quantity: value };
        }
        return entry;
      });
      return { ...prevData, location_quantity: updatedLocationQuantity };
    });
  };

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
    const selectedCompanyName = event.target.value; // Get selected supplier name

    // Find the corresponding supplier object from `supplierData`
    const selectedSupplierObject = supplierData.find(
      (supplier) => supplier.company_name === selectedCompanyName
    );

    // If valid supplier and not already selected
    if (selectedSupplierObject && !selectedSupplier.some((supplier) => supplier.supplier_id === selectedSupplierObject.supplier_id)) {
      setSelectedSupplier((prev) => [...prev, selectedSupplierObject]);
      // Update the productData to include supplier_id
      setProductData((prevData) => ({
        ...prevData,
        product_supplier: [
          ...prevData.product_supplier,
          { supplier_id: selectedSupplierObject.supplier_id },
        ],
      }));
    }
    // Reset the select dropdown
    setSelectedOption("");
  };


  const fetchSupplierData = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/supplier');
      setInitialSupplierData(response.data);
      setSupplierData(response.data)
    } catch (err) {
      console.error('Error fetching supplier data:', err);
    }
  };

  useEffect(() => {
    fetchSupplierData();
  }, []);

  useEffect(() => {
    console.log("supplier data", supplierData)
    setSelectedSupplier([]);
    setProductData((prevData) => ({
      ...prevData,
      product_supplier: []
    }));
    if (productData.type && initialSupplierData.length > 0) {
      const filteredSupplierData = initialSupplierData.filter((supplier) =>
        supplier.product_types.includes(productData.type)
      );
      setSupplierData(filteredSupplierData);
      console.log("Filtered Supplier Data:", filteredSupplierData);
    };
    console.log("supplier data after set", supplierData)

  }, [productData.type]);




  return (
    <div className="w-[70rem] relative pb-[10rem] px-5 ">
      <div className="grid grid-cols-2 gap-7">
        {/* Row 1 */}
        <div>
          <label htmlFor="productName" className="block text-sm font-medium text-gray-700">Product Name</label>
          <input
            type="text"
            id="productName"
            name="name"
            value={productData.name}
            onChange={handleInputChange}
            placeholder="Enter product name"
            className="mt-1 block w-full px-3 py-4 text-center text-sm border border-gray-300 rounded-xl shadow-sm  focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="productSize" className="block text-sm font-medium text-gray-700">Product Size/Model</label>
          <input
            type="text"
            id="productSize"
            name="size"
            value={productData.size}
            onChange={handleInputChange}
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
            name="quantity"
            value={productData.location_quantity.find((entry) => entry.location === "warehouse")?.quantity}
            onChange={handleLocationQuantityChange}
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
            name="reorder_level"
            value={productData.reorder_level}
            onChange={handleInputChange}
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
            name="unit_price"
            value={productData.unit_price}
            onChange={handleInputChange}
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

        <div className="relative">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <select
            id="category"
            className="mt-1 block w-full px-3 py-4 text-center text-sm border border-gray-300 rounded-xl shadow-sm focus:outline-none"
            name="type"
            value={productData.type}
            onChange={handleInputChange}
          >
            <option value="">Choose category</option>
            <option value="tire">Tire</option>
            <option value="oil">Oil</option>
            <option value="battery">Battery</option>
          </select>
        </div>

        {/* Row 4 */}
        <div>
          <label htmlFor="supplier" className="block text-sm font-medium text-gray-700">
            Suppliers
          </label>

          <TagInput
            tags={selectedSupplier}
            setTags={setSelectedSupplier}
            productData={productData}
            setProductData={setProductData}
          />

          <select
            id="supplier"
            className="mt-1 block w-full px-3 py-4 text-center text-sm border border-gray-300 rounded-xl shadow-sm focus:outline-none"
            onChange={handleSupplierChange}
            value={selectedOption}
            disabled={productData.type ? false : true}
          >
            <option value="">Select a supplier</option>
            {supplierData.map((supplier) => (
              <option
                key={supplier.supplier_id}
                value={supplier.company_name}
                disabled={selectedSupplier.some(
                  (selected) => selected.supplier_id === supplier.supplier_id
                )}
              >
                {supplier.company_name}
              </option>
            ))}
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

export default AddStockInput;