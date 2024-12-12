// EditQuantity.jsx
import React from "react";
import { useEffect, useState } from "react";

const EditQuantity = ({ saveNewQuantity, setNewQuantity, onClose, newQuantity }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [zeroQuantity, setZeroQuantity] = useState(false);
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleSave = () => {
    if (zeroQuantity) {
      alert("Please enter a valid quantity")
    }
    else {
      setIsVisible(false);
      setTimeout(saveNewQuantity, 300);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 bg-black bg-opacity-25 flex justify-center items-center transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-white p-6 rounded shadow-lg w-1/8 transition-transform duration-300 transform ${isVisible ? 'scale-100' : 'scale-90'}`}>
        <h2 className="text-xl font-semibold mb-4">Edit Quantity</h2>
        <div className="mb-4">
          <label className="block text-gray-700">New Quantity:</label>
          <input
            type="number"
            className="border border-gray-300 focus:outline-none focus:border-gray-700 px-3 py-2 w-full"
            value={newQuantity}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || (parseInt(value) > 0 && !isNaN(value) && parseInt(value) < 1001)) {
                setNewQuantity(value);
                setZeroQuantity(false)
                if (value === "") {
                  setZeroQuantity(true)
                  console.log("hi")
                }
              }
            }}
          />
        </div>
        <div className="flex justify-end gap-2 text-sm">
          <button
            className="bg-gray-300 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            className="bg-[#7fd6b2] hover:bg-[#7accaa] text-white px-4 py-2 rounded"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditQuantity;
