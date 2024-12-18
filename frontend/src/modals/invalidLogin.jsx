import React, { useEffect, useState } from "react";

const InvalidLogin = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100); // Start the popup animation
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Close the modal after a short delay
  };

  const handleOutsideClick = (e) => {
    // Close the modal when clicked outside the modal content
    if (e.target.id === "invalid-login-modal") {
      handleClose();
    }
  };

  return (
    <div 
      id="invalid-login-modal" 
      className={`fixed inset-0 z-50 flex justify-center items-start transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`} 
      onClick={handleOutsideClick}
    >
      <div 
        className={`bg-white p-6 rounded-lg w-1/2 md:w-1/3 transition-transform duration-300 transform ${isVisible ? 'translate-y-0' : '-translate-y-full'} shadow-lg`}
      >
        <h2 className="text-sm font-semibold mb-2 text-red-600">Invalid Login</h2>
        <p className="text-sm text-gray-700">The username or password you entered is incorrect. Please try again.</p>
      </div>
    </div>
  );
};

export default InvalidLogin;
