import React, { useEffect, useState } from "react";

const SuccessfullyDeletedModal = ({ onClose, rf_id }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100); // Slight delay for animation

    const autoCloseTimeout = setTimeout(() => {
      handleClose();
    }, 3000);

    return () => clearTimeout(autoCloseTimeout);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Close modal after animation
  };

  const handleOutsideClick = (e) => {
    if (e.target.id === "successfully-deleted-modal") {
      handleClose();
    }
  };

  return (
    
    <div 
      id="successfully-deleted-modal" 
      className={`fixed inset-0 z-50 flex justify-center items-start transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`} 
      onClick={handleOutsideClick}
    >
      <div 
        className={`bg-white p-6 rounded-lg w-1/2 md:w-1/3 transition-transform duration-300 transform ${isVisible ? 'translate-y-0' : '-translate-y-full'} shadow-lg`}
      >
        <h2 className="text-sm font-semibold mb-2 text-red-600">Delete Successful!</h2>
        <p className="text-sm text-gray-700">Request #{rf_id} has been successfully deleted.</p>
        <div className="mt-4 flex justify-end">
        </div>
      </div>
    </div>

  );
};

export default SuccessfullyDeletedModal;
