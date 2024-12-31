import { useState, useEffect, useRef } from "react";


const ApproveProduct = ({
  onClose,
  newQuantity,
  setNewQuantity,
  selectedProductQuantity,
  productId,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tempQuantity, setTempQuantity] = useState(newQuantity);
  const EditQuantityRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
    EditQuantityRef.current.focus();
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value === "" || (/^[0-9]*$/.test(value) && parseInt(value, 10) <= selectedProductQuantity)) {
      setTempQuantity(value);
    }
  };

  const handleSave = () => {
    setNewQuantity(productId, tempQuantity); // Pass productId and new quantity
    handleClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-black bg-opacity-10 flex justify-center items-center transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"
        }`}
    >
      <div
        className={`bg-white p-6 rounded-lg shadow-xl w-[80%] max-w-sm transition-transform duration-300 transform ${isVisible ? "scale-100" : "scale-95"
          }`}
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
          Product Checking
        </h2>
        <div className="mb-6">
          <label className="block text-gray-600 mb-2 text-sm font-medium">
            Approved Product Quantity:
          </label>
          <div className="flex justify-between items-center border border-gray-300 rounded-md px-4 py-2 focus-within:ring-2 focus-within:ring-green-400 focus-within:border-green-400">
            <input
              type="text"
              ref={EditQuantityRef}
              className="focus:outline-none w-full text-gray-800"
              value={tempQuantity}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && tempQuantity) {
                  handleSave();
                }
              }}
            />
            <span className="text-gray-500 ml-2 w-full flex justify-end">/ {selectedProductQuantity}</span>
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-md transition-all text-sm"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 disabled:bg-gray-400 rounded-md transition-all text-sm"
            disabled={!tempQuantity}
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};


export default ApproveProduct;