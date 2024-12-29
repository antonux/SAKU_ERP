import React, { useState, useEffect } from 'react';

const ViewDrModal = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedReceiptId, setSelectedReceiptId] = useState(null); // State to track selected receipt

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Ensure animation finishes before unmounting
  };

  // Example data for receipts
  const receipts = [
    { id: 1, name: "Receipt 1", date: "2024-12-30", amount: "$50.00" },
    { id: 2, name: "Receipt 2", date: "2024-12-29", amount: "$25.00" },
    { id: 3, name: "Receipt 3", date: "2024-12-28", amount: "$40.00" },
    { id: 4, name: "Receipt 4", date: "2024-12-27", amount: "$60.00" },
  ];

  const handleSelectReceipt = (id) => {
    setSelectedReceiptId(id);
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-10 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-white flex flex-col p-8 pb-4 rounded-lg shadow-lg w-[50rem] h-[35rem] relative transition-transform duration-300 transform ${isVisible ? 'scale-100' : 'scale-90'}`}>
        {/* Header or Title */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Delivery Receipts</h3>
          <button
            onClick={handleClose}
            className="text-gray-700 hover:text-gray-900"
          >
            X
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-grow overflow-auto">
          <div className="grid p-2 grid-cols-4 gap-6">
            {receipts.map((receipt) => (
              <div
                key={receipt.id}
                onClick={() => handleSelectReceipt(receipt.id)} // Handle selection on click
                className={`flex flex-col items-center justify-center p-4 border rounded-lg shadow-md cursor-pointer transition-transform transform hover:scale-105 
                  ${selectedReceiptId === receipt.id ? 'border-blue-500' : 'border-gray-300'}`} // Change border color if selected
              >
                <h4 className="font-semibold text-gray-800">{receipt.name}</h4>
                <p className="text-gray-600 text-sm">{receipt.date}</p>
                <p className="text-gray-700 font-semibold">{receipt.amount}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer with Check Receipt Button */}
        <div className="flex justify-end mt-4">
          <button
            onClick={handleClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-md transition-all text-sm mr-4"
          >
            Close
          </button>
          <button
            onClick={() => alert(`Checking receipt ${selectedReceiptId}`)}
            className="bg-green-400 hover:bg-green-500 text-white px-5 py-2 rounded-md transition-all text-sm"
          >
            Check Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewDrModal;
