import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

// Components
import GoBackButton from "../../components/buttons/Backbutton";

// Context
import { useRole } from "../../contexts/RoleContext";

// Modals
import DeleteRequest from "../../modals/DeleteRequest";
import ApproveRequest from "../../modals/approveRequest";
import CancelRequest from "../../modals/cancelRequest";
import AcknowledgeRequest from "../../modals/acknowledgeRestock";

// Hooks
import useRestockData from '../../hooks/useRestockData';

// axios
import axios from "axios";

const AddStock = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const { mappedData, restockData } = useRestockData(refreshKey);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userID } = useRole();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showAcknowledeModal, setShowAcknowledeModal] = useState(false);
  const { requestFormData: item } = location.state;
  const [requestFormData, setRequestFormData] = useState(item)



  useEffect(() => {
    if (location.pathname !== "/request") {
      localStorage.setItem("lastRequestPath", location.pathname);
    }
  }, []);

  const handleGoBack = () => {
    localStorage.setItem("lastRequestPath", "/request/view-more");
    const lp = localStorage.getItem("lastRequestPath")
    navigate(lp,{ state: { item: item }});
  };


  const products = restockData.request_details
    .filter((detail) => detail.rf_id === requestFormData.rf_id)
    .map((detail) => {
      const product = restockData.product.find((prod) => prod.prod_id === detail.product_id);
      return {
        id: product ? product.prod_id : "N/A",
        product: product ? product.name : "Unknown Product",
        size: product ? product.size : "Unknown Size",
        category: product ? product.type : "Unknown Category",
        quantity: detail.quantity || 0,
        amount: product ? product.unit_price : 0,
        total: product && detail.quantity ? product.unit_price * detail.quantity : 0,
        status: detail.status || "Unknown",
      };
    });

  const totalAmount = products.reduce((sum, product) => sum + product.total, 0);



  const sortedData = mappedData.sort((a, b) => {
    const dateA = a.updatedAt || a.date; // Use updatedAt if available, otherwise date
    const dateB = b.updatedAt || b.date;

    return dateB - dateA; // Most recent first
  });


  const hasDelivered = products.some((product) => product.status === "delivered");

  const canViewAR = hasDelivered;

  // const hasUnavailable = products.some((product) => product.status === "unavailable");

  const showStatus = requestFormData.status === "pending" || requestFormData.status === "approved" || requestFormData.status === "cancelled";

  const update_received = requestFormData.status === "partially delivered" || requestFormData.status === "completed" ? "Received By:" : "Updated By:" 


  return (
    <div className='flex flex-col gap-4 h-screen pb-5 pt-7'>
      <button onClick={handleGoBack} className="absolute z-50 translate-y-[3.2rem]">
        <GoBackButton />
      </button>
      <div className="flex flex-col pt-5 px-7 pb-10 gap-10 mt-[6rem] w-full h-full shadow-md overflow-auto rounded-lg bg-white text-black scrollbar-thin">
        <h1 className="text-xl font-semibold text-[#272525]">Acknowledgement Receipt</h1>
        <div className="flex gap-5 whitespace-nowrap">
          <div className="flex gap-1">
            <h1>Requested By:</h1>
            <h1 className="font-semibold capitalize">{requestFormData.requestedBy}</h1>
          </div>
          <div className="flex gap-1">
            <h1>Date Created:</h1>
            <h1 className="font-semibold">{requestFormData.date.toLocaleDateString()}</h1>
          </div>
          <div className="flex gap-1">
            {/* <h1>Received By:</h1> */}
            {update_received}
            <h1 className="font-semibold capitalize">{requestFormData.updatedBy || "—"}</h1>
          </div>
          <div className="flex gap-1">
            <h1>Status:</h1>
            <h1 className={`capitalize font-semibold 
              ${requestFormData.status === "pending" ? "text-[#f29425]" :
                requestFormData.status === "approved" ? "text-green-400" :
                  requestFormData.status === "cancelled" ? "text-red-500" :
                    requestFormData.status === "to be received" ? "text-blue-500" :
                      requestFormData.status === "partially delivered" ? "text-blue-500" :
                        requestFormData.status === "completed" ? "text-green-500" : ""
              }`
            }>
              {requestFormData.status}
            </h1>
          </div>
          {/* <div className="flex gap-1">
            <h1>Date Approved:</h1>
            <h1 className="font-semibold">{requestFormData.updatedAt}</h1>
          </div> */}
        </div>
        <div className="rounded-lg w-[56rem] mb-10 shrink-0 border-[1px] border-gray-100 overflow-auto scrollbar-thin">
          <table className="text-sm w-[55rem] text-left text-gray-500">
            <thead className="sticky top-0 bg-white">
              <tr className="text-xs text-gray-700 uppercase">
                <th scope="col" className="px-6 py-3">ID</th>
                <th scope="col" className="px-6 py-3">Product</th>
                <th scope="col" className="px-6 py-3">Size/Model</th>
                <th scope="col" className="px-6 py-3">Category</th>
                <th scope="col" className="px-6 py-3">Quantity</th>
                <th scope="col" className="px-6 py-3">Amount</th>
                <th scope="col" className="px-6 py-3">Total Amount</th>
                <th scope="col" className={`px-6 py-3 ${showStatus ? "hidden" : ""}`}>Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="bg-white border-b hover:bg-gray-50 capitalize">
                  <td className="px-6 py-5">{product.id}</td>
                  <td className="px-6 py-5">{product.product}</td>
                  <td className="px-6 py-5">{product.size}</td>
                  <td className="px-6 py-5">{product.category}</td>
                  <td className="px-6 py-5">{product.quantity}</td>
                  <td className="px-6 py-5">₱{product.amount.toLocaleString()}</td>
                  <td className="px-6 py-5">₱{product.total.toLocaleString()}</td>
                  <td className={`${showStatus ? "hidden" : ""} px-6 py-5 font-semibold 
                    ${product.status === "available" ? "text-green-500"
                      : product.status === "unavailable" ? "text-red-500"
                        : product.status === "to be received" ? "text-blue-600"
                          : product.status === "delivered" ? "text-blue-600" : ""
                    }`}>
                    {product.status}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-white">
                <td colSpan="6" className="px-6 py-4 font-semibold">TOTAL</td>
                <td className="px-6 py-5 font-semibold">₱{totalAmount.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AddStock;
