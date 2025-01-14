import React, { useEffect, useState } from "react";

const PurchaseRequest = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade-in the modal initially
    setTimeout(() => setIsVisible(true), 100);

    // Set a timeout to automatically close the modal after 3 seconds
    const autoCloseTimeout = setTimeout(() => {
      handleClose();
    }, 3000); // Auto-close after 3 seconds

    // Clean up the timeout when the component unmounts
    return () => clearTimeout(autoCloseTimeout);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Wait for the fade-out transition before triggering onClose
    setTimeout(onClose, 300); 
  };

  const handleOutsideClick = (e) => {
    if (e.target.id === "restock-request-modal") {
      handleClose();
    }
  };

  return (
    <div 
      id="restock-request-modal" 
      className={`fixed inset-0 z-50 flex justify-center items-start transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`} 
      onClick={handleOutsideClick}
      style={{
        pointerEvents: "auto", // Allow clicks on the backdrop
      }}
    >
      <div 
        className={`bg-white p-6 rounded-lg w-1/2 md:w-1/3 transition-transform duration-300 transform ${isVisible ? 'translate-y-0' : '-translate-y-full'} shadow-lg`}
        style={{
          pointerEvents: "all", // Allow clicks inside the modal
        }}
      >
        <h2 className="text-sm font-semibold mb-2 text-green-600">Purchase Request Successful!</h2>
        <p className="text-sm text-gray-700">Your purchase request has been submitted successfully.</p>
        <div className="mt-4 flex justify-end">
          {/* Add any buttons or content here */}
        </div>
      </div>
    </div>
  );
};

export default PurchaseRequest;
