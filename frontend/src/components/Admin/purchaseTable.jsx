import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

// Modals
import DeleteRequestSuccessful from "../../modals/DeleteRequestSuccessful";

// Hooks
import usePurchaseData from '../../hooks/usePurchaseData';
import useStatusColor from '../../hooks/useStatusColor';

const Table = () => {
  const { mappedData, error, purchaseData, loading } = usePurchaseData();
  const { getStatusColor } = useStatusColor();
  const navigate = useNavigate();
  const location = useLocation();
  const { isSuccess: isDeleted, rf_id } = location.state || false;
  const [isRequestDeleted, setIsRequestDeleted] = useState(false);
  const [inventoryFilter, setInventoryFilter] = useState("All");

  useEffect(() => {
    if (isDeleted) {
      setIsRequestDeleted(true)
    }
  }, [isDeleted])

  const closeRequestDeletedModal = () => {
    setIsRequestDeleted(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }


  // Sort mappedData by updatedAt (if available) or fallback to date
  const sortedData = [...mappedData].sort((a, b) => {
    const dateA = a.updatedAt || a.createdAt;
    const dateB = b.updatedAt || b.createdAt;
    return dateB - dateA; // Most recent first
  });

  return (
    <div className="rounded-lg h-full bg-white shadow-md overflow-auto scrollbar-thin">
      {isRequestDeleted && (
        <DeleteRequestSuccessful
          onClose={closeRequestDeletedModal}
          rf_id={rf_id}
        />
      )}
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="sticky top-0">
          <tr className="text-xs text-gray-700 bg-white">
            <th colSpan="10" className="px-6 py-5">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-5">
                  <h1 className="text-xl font-semibold text-[#272525]">
                    All Purchase Request
                  </h1>
                </div>
                <div className="flex text-sm items-center space-x-2 gap-2 text-center pr-12 cursor-pointer">
                  <h1 className="font-normal text-[#272525] cursor-default">
                    Filter Date:
                  </h1>
                  <input
                    type="date"
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm font-normal text-[#272525] focus:ring-2 focus:ring-gray-400 outline-none"
                  />
                </div>
              </div>
            </th>
          </tr>
          <tr className="text-xs text-gray-700 uppercase bg-white">
            <th scope="col" className="px-6 py-3">S/N</th>
            <th scope="col" className="px-6 py-3">Category</th>
            <th scope="col" className="px-6 py-3">Total Qty</th>
            <th scope="col" className="px-6 py-3">Total Amount</th>
            <th scope="col" className="px-6 py-3">Supplier</th>
            <th scope="col" className="px-6 py-3">Requested By</th>
            <th scope="col" className="px-6 py-3">Updated By</th>
            <th scope="col" className="px-6 py-3">Date</th>
            <th scope="col" className="px-6 py-3">Status</th>
            <th scope="col" className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item, index) => (
            <tr key={item.po_id} className="bg-white border-b hover:bg-gray-50 capitalize">
              <td className="px-6 py-5">{index + 1}</td>
              <td className="px-6 py-5">{item.productCategory}</td>
              <td className="px-6 py-5">{item.totalQty}</td>
              <td className="px-6 py-5">{item.totalAmount.toFixed(2)}</td>
              <td className="px-6 py-5">{item.supplier}</td>
              <td className="px-6 py-5">{item.requestedBy}</td>
              <td className="px-6 py-5">{item.updatedBy || "—"}</td>
              <td className="px-6 py-5">{item.updatedAt ? item.updatedAt.toLocaleDateString() : item.createdAt.toLocaleDateString()}</td>
              <td className={`px-6 py-5 ${getStatusColor(item.status)}`}>
                {item.status}
              </td>
              <td className="px-6 py-5">
                <Link to="/purchase/view-more" state={{ item, purchaseData }}>
                  <button className="text-blue-500 hover:underline">{item.action}</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;

