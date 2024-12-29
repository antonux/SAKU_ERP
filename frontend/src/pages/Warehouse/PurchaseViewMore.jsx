
import { useNavigate, useLocation, Link } from "react-router-dom";
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
import ViewDrModal from "../../components/Warehouse/viewDrModal";

// Hooks
import usePurchaseData from '../../hooks/usePurchaseData';
import useStatusColor from '../../hooks/useStatusColor';

// axios
import axios from "axios";

const PurchaseViewMore = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const { mappedData, purchaseData } = usePurchaseData(refreshKey);
  const [showFloating, setShowFloating] = useState(false)
  const { getStatusColor } = useStatusColor();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userID } = useRole();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showAcknowledeModal, setShowAcknowledeModal] = useState(false);
  const [receivedDelivery, setReceivedDelivery] = useState(false);
  const { item } = location.state;
  const [requestFormData, setRequestFormData] = useState(item)



  useEffect(() => {
    if (location.pathname !== "/purchase") {
      localStorage.setItem("lastRequestPath", location.pathname);
    }
  }, []);

  const handleGoBack = () => {
    localStorage.setItem("lastPurchasePath", "/purchase");
    const lp = localStorage.getItem("lastPurchasePath")
    navigate(lp);
  };


  const products = purchaseData.request_details
    .filter((detail) => detail.rf_id === requestFormData.rf_id)
    .map((detail) => {
      const product = purchaseData.product.find((prod) => prod.prod_id === detail.product_id);
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

  const deleteRequest = async (rf_id) => {
    try {
      const response = await axios.delete(`http://localhost:4000/api/request/delete/${rf_id}`);
      console.log('Request deleted:', response.data);
      navigate('/purchase', { state: { isSuccess: true, rf_id: requestFormData.rf_id } });
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };
  const handleDeleteClick = (rf_id) => {
    deleteRequest(rf_id);
  };

  const approveRequest = async () => {
    try {
      const requestData = {
        rf_id: requestFormData.rf_id,
        user_id: userID,
        status: "approved"
      };

      const response = await axios.post('http://localhost:4000/api/request/update', requestData);
      console.log('Request approved:', response.data);
      setRefreshKey(prevKey => prevKey + 1);
      setTimeout(() => {
        setShowApproveModal(true);  // Show the modal after delay
      }, 150);

    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleApproveClick = () => {
    approveRequest();
  };

  const cancelRequest = async () => {
    try {
      const requestData = {
        rf_id: requestFormData.rf_id,
        user_id: userID,
        status: "cancelled"
      };

      const response = await axios.post('http://localhost:4000/api/request/update', requestData);
      console.log('Request cancelled:', response.data);

      setRefreshKey(prevKey => prevKey + 1);
      setTimeout(() => {
        setShowCancelModal(true);  // Show the modal after delay
      }, 150);

    } catch (error) {
      console.error('Error cancelling request:', error);
    }
  };

  const handleCancelClick = () => {
    cancelRequest();
  };

  const acknowledgeRequestFunc = async () => {
    try {
      const requestData = {
        rf_id: requestFormData.rf_id,
        user_id: userID,
      };

      const response = await axios.post('http://localhost:4000/api/request/restock/acknowledge', requestData);
      console.log('Request acknowledged:', response.data);

      setRefreshKey(prevKey => prevKey + 1);
      setTimeout(() => {
        setShowAcknowledeModal(true);
      }, 150);

    } catch (error) {
      console.error('Error acknowledging request:', error);
    }
  };

  const handleAcknowledgeClick = () => {
    acknowledgeRequestFunc();
  };

  const receivePurchaseFunc = async () => {
    try {
      const requestData = {
        rf_id: requestFormData.rf_id,
        user_id: userID,
        status: "received"
      };

      const response = await axios.post('http://localhost:4000/api/request/update', requestData);
      console.log('Purchase received:', response.data);

      setRefreshKey(prevKey => prevKey + 1);
      setTimeout(() => {
        setReceivedDelivery(true);  // Show the modal after delay
      }, 150);

    } catch (error) {
      console.error('Error receiving purchase:', error);
    }
  };

  const handleReceiveClick = () => {
    receivePurchaseFunc();
  };



  const sortedData = mappedData.sort((a, b) => {
    const dateA = a.updatedAt || a.date; // Use updatedAt if available, otherwise date
    const dateB = b.updatedAt || b.date;

    return dateB - dateA; // Most recent first
  });

  useEffect(() => {
    const itemToNavigate = sortedData.find(item => item.rf_id === requestFormData.rf_id);
    if (itemToNavigate) {
      setRequestFormData(itemToNavigate);
      console.log('updated rf data: ', requestFormData)
    }
  }, [showApproveModal, showCancelModal, showAcknowledeModal, receivedDelivery])

  const canDeleteRequest =
    user === "warehouse" && (requestFormData.status === "pending" || requestFormData.status === "cancelled");

  const canCancelRequest =
    user === "admin" &&
    requestFormData.status === "pending";

  const canMarkReceived =
    user === "warehouse" &&
    requestFormData.status === "approved";

  const canApproveRequest =
    (user === "admin" || user === "manager") &&
    requestFormData.status === "pending";

  const canAcknowledgeRequest =
    (user === "store" || user === "manager") &&
    (requestFormData.status === "to be received");

  const canViewDR =
    user === "warehouse" && (requestFormData.status !== "pending" && requestFormData.status !== "cancelled" && requestFormData.status !== "approved");

  const hasDelivered = products.some((product) => product.status === "delivered");

  const canViewAR = hasDelivered;

  const hasUnavailable = products.some((product) => product.status === "unavailable");
  const hasAvailable = products.some((product) => product.status === "available");

  const showStatus = requestFormData.status === "pending" || requestFormData.status === "approved" || requestFormData.status === "cancelled" || hasAvailable || hasUnavailable;


  return (
    <div className='flex flex-col gap-4 h-screen pb-5 pt-7'>
      {showApproveModal &&
        <ApproveRequest
          onClose={() => setShowApproveModal(false)}
        />
      }
      {showCancelModal &&
        <CancelRequest
          onClose={() => setShowCancelModal(false)}
        />
      }
      {showAcknowledeModal &&
        <AcknowledgeRequest
          onClose={() => setShowAcknowledeModal(false)}
        />
      }
      {showFloating && (
        <ViewDrModal
          onClose={() => setShowFloating(false)}
        />
      )}
      <button onClick={handleGoBack} className="absolute z-50 translate-y-[3.2rem]">
        <GoBackButton />
      </button>
      <div className="flex flex-col pt-5 px-7 pb-10 gap-10 mt-[6rem] w-full h-full shadow-md overflow-auto rounded-lg bg-white text-black scrollbar-thin">
        <h1 className="text-xl font-semibold text-[#272525]">Product Request</h1>
        <div className="flex gap-5 whitespace-nowrap">
          <div className="flex gap-1">
            <h1>Request Form No.:</h1>
            <h1 className="font-semibold capitalize">{requestFormData.rf_id}</h1>
          </div>
          <div className="flex gap-1">
            <h1>Requested By:</h1>
            <h1 className="font-semibold capitalize">{requestFormData.requestedBy}</h1>
          </div>
          <div className="flex gap-1">
            <h1>Date Created:</h1>
            <h1 className="font-semibold">{requestFormData.createdAt.toLocaleDateString()}</h1>
          </div>
          <div className="flex gap-1">
            <h1>Updated By:</h1>
            <h1 className="font-semibold capitalize">{requestFormData.updatedBy || "—"}</h1>
          </div>
          <div className="flex gap-1">
            <h1>Status:</h1>
            <h1 className={`capitalize font-semibold ${getStatusColor(requestFormData.status)}`
            }>
              {requestFormData.status}
            </h1>
          </div>
          {/* <div className="flex gap-1">
            <h1>Date Approved:</h1>
            <h1 className="font-semibold">{requestFormData.updatedAt}</h1>
          </div> */}
        </div>
        <div>
          <div className="flex gap-1">
            <h1>Supplier:</h1>
            <h1 className="font-semibold capitalize">{requestFormData.supplier}</h1>
          </div>
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
        <div className="flex gap-7">
          {showDeleteModal &&
            <DeleteRequest
              onConfirm={() => handleDeleteClick(requestFormData.rf_id)}
              onClose={() => {
                setShowDeleteModal(false);
              }}
            />
          }
          {canDeleteRequest && (
            <button
              className="bg-red-400 text-white font-normal text-sm px-14 py-[.72rem] rounded-lg hover:bg-[#eb6b6b] transition-all focus:outline-none focus:ring-2 focus:ring-green-50"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete Request
            </button>
          )}

          {canCancelRequest && (
            <button
              className="bg-red-400 text-white font-normal text-sm px-14 py-[.72rem] rounded-lg hover:bg-[#eb6b6b] transition-all focus:outline-none focus:ring-2 focus:ring-green-50"
              onClick={() => handleCancelClick()}
            >
              Cancel Request
            </button>
          )}

          {canApproveRequest && (
            <button
              onClick={() => handleApproveClick()}
              className="bg-[#7fd6b2] text-white font-normal text-sm px-20 py-[.72rem] rounded-lg hover:bg-[#71c2a0] focus:outline-none focus:ring-2 focus:ring-green-50"
            >
              Approve
            </button>
          )}
          {canAcknowledgeRequest && (
            <button
              onClick={() => handleAcknowledgeClick()}
              className="bg-[#7fd6b2] text-white font-normal text-sm px-12 py-[.72rem] rounded-lg hover:bg-[#71c2a0] focus:outline-none focus:ring-2 focus:ring-green-50"
            >
              Acknowledge
            </button>
          )}
          {canMarkReceived && (
            <button
              onClick={() => handleReceiveClick()}
              className="bg-[#7fd6b2] text-white font-normal text-sm px-12 py-[.72rem] rounded-lg hover:bg-[#79ceaa] focus:outline-none focus:ring-2 focus:ring-green-50"
            >
              Receive Delivery
            </button>
          )}
          {canViewAR && (
            <Link to="/request/acknowledge-receipt" state={{ requestFormData }}>
              <button
                // onClick={() => handleAcknowledgeClick()}
                className="bg-[#7fd6b2] text-white font-normal text-sm px-12 py-[.72rem] rounded-lg hover:bg-[#71c2a0] focus:outline-none focus:ring-2 focus:ring-green-50"
              >
                View AR
              </button>
            </Link>
          )}
          {canViewDR && (
            <button
              onClick={() => setShowFloating(true)}
              className="bg-blue-500 text-white font-normal text-sm px-12 py-[.72rem] rounded-lg hover:bg-blue-500/90 focus:outline-none focus:ring-2 focus:ring-green-50"
            >
              View DR
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseViewMore;
