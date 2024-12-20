// EditQuantity.jsx
import React, { useEffect, useState, useRef } from "react";

const EditQuantity = ({ saveNewQuantity, setNewQuantity, onClose, newQuantity }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [zeroQuantity, setZeroQuantity] = useState(false);
  const EditQuantityRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
    EditQuantityRef.current.focus();
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleSave = () => {
    if (!zeroQuantity) {
      setIsVisible(false);
      setTimeout(saveNewQuantity, 300);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-black bg-opacity-10 flex justify-center items-center transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-white p-6 rounded-lg shadow-xl w-[80%] max-w-sm transition-transform duration-300 transform ${
          isVisible ? "scale-100" : "scale-95"
        }`}
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
          Edit Quantity
        </h2>
        <div className="mb-6">
          <label className="block text-gray-600 mb-2 text-sm font-medium">
            Enter New Quantity:
          </label>
          <input
            type="number"
            className="border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 px-4 py-2 w-full text-gray-800"
            ref={EditQuantityRef}
            value={newQuantity}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "") {
                setNewQuantity("");
                setZeroQuantity(true);
                return;
              }
              if (value.includes(".")) {
                e.preventDefault();
                return;
              }
              if (parseInt(value) > 0 && parseInt(value) < 1001 && !isNaN(value)) {
                setNewQuantity(value);
                setZeroQuantity(false);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !zeroQuantity) {
                handleSave();
              }
            }}
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
            disabled={zeroQuantity}
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
