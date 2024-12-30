import React, { useEffect, useState, useRef } from "react";

const ApproveProduct = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [newQuantity, setNewQuantity] = useState(""); // Store the input value

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  // Function to handle input changes
  const handleInputChange = (e) => {
    const value = e.target.value;

    // Allow only numbers and prevent negatives
    if (value === "" || /^[0-9]*$/.test(value)) {
      setNewQuantity(value);
    }
  };

  const handleSave = () => {
    console.log("Saved quantity:", newQuantity);
    // Add your logic to save the quantity
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
          <input
            type="text"
            className="border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 px-4 py-2 w-full text-gray-800"
            value={newQuantity}
            onChange={handleInputChange} // Handle input changes
          />
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
            disabled={!newQuantity} // Disable if no quantity is entered
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
