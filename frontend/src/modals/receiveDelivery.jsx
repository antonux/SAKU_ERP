
import React, { useEffect, useState } from "react";

const ReceiveDelivery = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100); // Fade-in effect

    const autoCloseTimeout = setTimeout(() => {
      handleClose();
    }, 3000);

    return () => clearTimeout(autoCloseTimeout);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Close after animation
  };

  const handleOutsideClick = (e) => {
    // Close the modal if the click is outside the modal content
    if (e.target.id === "restock-request-modal") {
      handleClose();
    }
  };

  return (
    <div
      id="restock-request-modal"
      className={`fixed inset-0 z-50 flex justify-center items-start transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleOutsideClick}
      style={{
        pointerEvents: "auto", // Make sure clicking the backdrop still triggers events
      }}
    >
      <div
        className={`bg-white p-6 rounded-lg w-1/2 md:w-1/3 transition-transform duration-300 transform ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        } shadow-lg`}
        style={{
          pointerEvents: "all", // Allow interaction inside the modal
        }}
      >
        <h2 className="text-sm font-semibold mb-2 text-blue-600">Delivery Received!</h2>
        <p className="text-sm text-gray-700">
          Please check delivery receipts accordingly.
        </p>
        <div className="mt-4 flex justify-end">
          {/* Add any buttons or content here */}
        </div>
      </div>
    </div>
  );
};

export default ReceiveDelivery;
