import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

//hooks
import useStatusColor from '../../hooks/useStatusColor';

const ViewDrModal = ({ onClose, po_id, item }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [allReceipts, setAllReceipts] = useState([]); // All fetched receipts
  const [filteredReceipts, setFilteredReceipts] = useState([]); // Receipts filtered by po_id
  const [selectedReceiptId, setSelectedReceiptId] = useState(null); // State to track selected receipt
  const { getStatusColor } = useStatusColor();

  useEffect(() => {
    setIsVisible(true);
    fetchDeliveryReceipts(); // Fetch receipts on mount
  }, []);

  useEffect(() => {
    // Filter receipts based on po_id whenever allReceipts or po_id changes
    const filtered = allReceipts.filter((receipt) => receipt.po_id === po_id);
    setFilteredReceipts(filtered);
  }, [allReceipts, po_id]);

  const fetchDeliveryReceipts = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/purchase/receive');
      setAllReceipts(response.data.receipts); // Populate allReceipts with API data
    } catch (error) {
      console.error('Error fetching delivery receipts:', error);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setSelectedReceiptId(null);
    setTimeout(onClose, 300); // Ensure animation finishes before unmounting
  };

  const handleSelectReceipt = (id) => {
    setSelectedReceiptId(id);
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-10 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-white flex flex-col p-8 pb-4 rounded-lg shadow-lg w-[50rem] h-[35rem] relative transition-transform duration-300 transform ${isVisible ? 'scale-100' : 'scale-90'}`}>
        {/* Header */}
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
          <div className="flex flex-col gap-4 p-5">
            {filteredReceipts.map((receipt) => (
              <div
                key={receipt.id}
                onClick={() => handleSelectReceipt(receipt.id)} // Handle selection on click
                className={`flex items-center justify-between p-4 border rounded-lg shadow-md cursor-pointer transition-transform transform hover:scale-[101%] 
                  ${selectedReceiptId === receipt.id ? 'border-green-700' : 'border-gray-300'}`} // Change border color if selected
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{`Receipt ID: ${receipt.id}`}</h4>
                  <p className="text-gray-600 text-sm">{new Date(receipt.date).toLocaleDateString()}</p>
                </div>
                <div className="flex-1 text-right capitalize">
                  <p className={`${getStatusColor(receipt.status)} font-semibold`}>{receipt.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-4">
          <button
            onClick={handleClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-md transition-all text-sm mr-4"
          >
            Close
          </button>
          <div className={`${!selectedReceiptId ? "pointer-events-none" : ""}`}>
            <Link to="/purchase/delivery-receipt" state={{ item, receipt: filteredReceipts.find((receipt) => receipt.id === selectedReceiptId) }}>
              <button
                type='button'
                className={`disabled:pointer-events-none disabled:bg-gray-300 bg-green-400 hover:bg-green-500 text-white px-5 py-2 rounded-md transition-all text-sm`}
                disabled={selectedReceiptId === null}
              >
                View Receipt
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDrModal;
