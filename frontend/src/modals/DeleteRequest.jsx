import React, { useEffect, useState } from "react";
import { AiOutlineWarning } from "react-icons/ai"; // Caution icon from react-icons

const DeleteRequestModal = ({ onConfirm, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Close after animation
  };

  const handleConfirm = () => {
    setIsVisible(false);
    setTimeout(onConfirm, 300); // Confirm after animation
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-black bg-opacity-20 flex justify-center items-center transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-white p-5 rounded-lg shadow-md w-[85%] max-w-sm transition-transform duration-300 transform ${
          isVisible ? "scale-100" : "scale-95"
        }`}
      >
        <div className="flex flex-col items-center text-center">
          {/* Caution Icon */}
          <AiOutlineWarning className="text-red-500 text-4xl mb-3" />
          {/* Title */}
          <h2 className="text-lg font-medium text-gray-800 mb-2">
            Confirm Deletion
          </h2>
          {/* Message */}
          <p className="text-sm text-gray-600 mb-4">
            Are you sure you want to delete this request? This action cannot be
            undone.
          </p>
        </div>
        {/* Buttons */}
        <div className="flex justify-center gap-3">
          <button
            type="button"
            className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-md text-sm transition-all"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition-all"
            onClick={handleConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteRequestModal;
