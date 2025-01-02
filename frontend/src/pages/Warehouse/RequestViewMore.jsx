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
import DeliverRequest from "../../modals/deliverRequest";

// Hooks
import useRestockData from '../../hooks/useRestockData';
import useStatusColor from '../../hooks/useStatusColor';

// axios
import axios from "axios";

const AddStock = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const { mappedData, error, restockData } = useRestockData(refreshKey);
  const { getStatusColor } = useStatusColor();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userID } = useRole();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDeliverModal, setShowDeliverModal] = useState(false);
  const { item } = location.state;
  const [requestFormData, setRequestFormData] = useState(item)



  useEffect(() => {
    if (location.pathname !== "/request") {
      localStorage.setItem("lastRequestPath", location.pathname);
    }
  }, []);

  const handleGoBack = () => {
    localStorage.setItem("lastRequestPath", "/request");
    const lp = localStorage.getItem("lastRequestPath")
    navigate(lp);
  };


  // const products = restockData.request_details
  //   .filter((detail) => detail.rf_id === requestFormData.rf_id)
  //   .map((detail) => {
  //     const product = restockData.product.find((prod) => prod.prod_id === detail.product_id);
  //     return {
  //       id: product ? product.prod_id : "N/A",
  //       product: product ? product.name : "Unknown Product",
  //       size: product ? product.size : "Unknown Size",
  //       category: product ? product.type : "Unknown Category",
  //       quantity: detail.quantity || 0,
  //       amount: product ? product.unit_price : 0,
  //       total: product && detail.quantity ? product.unit_price * detail.quantity : 0,
  //     };
  //   });

  const products = restockData.request_details
  .filter((detail) => detail.rf_id === requestFormData.rf_id)
  .map((detail) => {
    const product = restockData.product.find((prod) => prod.prod_id === detail.product_id);
    const inventory = restockData.inventory.find(
      (inv) => inv.product_id === detail.product_id && inv.location === "warehouse"
    );

    const currentWarehouseStock = inventory ? inventory.quantity : 0;
    const reorderLevel = product ? product.reorder_level : 0;
    const expectedStock = currentWarehouseStock - detail.quantity;

    let stockStatus = "unknown";
    if (expectedStock > reorderLevel) {
      stockStatus = "in stock";
    } else if (expectedStock <= reorderLevel && expectedStock > 0) {
      stockStatus = "low stock";
    } else if (expectedStock <= 0) {
      stockStatus = "out of stock";
    }

    let completeStockStatus = "unknown";
    if (currentWarehouseStock > reorderLevel) {
      completeStockStatus = "in stock";
    } else if (currentWarehouseStock <= reorderLevel) {
      completeStockStatus = "low stock";
    } else if (currentWarehouseStock <= 0) {
      completeStockStatus = "out of stock";
    }

    return {
      id: product ? product.prod_id : "N/A",
      product: product ? product.name : "Unknown Product",
      size: product ? product.size : "Unknown Size",
      category: product ? product.type : "Unknown Category",
      quantity: detail.quantity || 0,
      amount: product ? product.unit_price : 0,
      total: product && detail.quantity ? product.unit_price * detail.quantity : 0,
      currentWarehouseStock,
      expectedStock,
      completeStockStatus,
      stockStatus,
      status: detail.status || "Unknown",
    };
  });

  const totalAmount = products.reduce((sum, product) => sum + product.total, 0);



  const deleteRequest = async (rf_id) => {
    try {
      const response = await axios.delete(`http://localhost:4000/api/request/delete/${rf_id}`);
      console.log('Request deleted:', response.data);
      navigate('/request', { state: { isSuccess: true, rf_id: requestFormData.rf_id } });
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

  const deliverRequest = async () => {
    try {
      const requestData = {
        rf_id: requestFormData.rf_id,
        user_id: userID,
        status: "to be received"
      };

      const response = await axios.post('http://localhost:4000/api/request/restock/deliver', requestData);
      console.log('Request delivered:', response.data);

      setRefreshKey(prevKey => prevKey + 1);
      setTimeout(() => {
        setShowDeliverModal(true);  // Show the modal after delay
      }, 150);

    } catch (error) {
      console.error('Error delivering request:', error);
    }
  };

  const handleDeliverClick = () => {
    deliverRequest();
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
  }, [showApproveModal, showCancelModal, showDeliverModal])

  const canDeleteRequest =
    (user === "store" || (user === "manager" && requestFormData.requestedByRole === "manager")) &&
    requestFormData.status !== "approved";

  const canCancelRequest =
    (user === "admin" || (user === "manager" && requestFormData.requestedByRole !== "manager")) &&
    requestFormData.status !== "approved" &&
    requestFormData.status !== "cancelled";

  const canApproveRequest =
    (user === "admin" || user === "manager") &&
    requestFormData.status !== "approved" &&
    requestFormData.status !== "cancelled";


  const hasAvailable = products.some((product) => product.status === "available");
  const hasUnavailable = products.some((product) => product.status === "unavailable");

  const DeliverText = hasAvailable && hasUnavailable
    ? "partial deliver"
    : !hasUnavailable && hasAvailable
      ? "deliver"
      : "unavailable";

  const canDeliverRequest =
    user === "warehouse" && (requestFormData.status !== "cancelled" && requestFormData.status !== "pending") ;

  const canRequestPurchase =
    user === "warehouse" && (requestFormData.status !== "cancelled" && requestFormData.status !== "pending") ;

  const hasDelivered = products.some((product) => product.status === "delivered");

  const canViewAR = hasDelivered;

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
      {showDeliverModal &&
        <DeliverRequest
          onClose={() => setShowDeliverModal(false)}
        />
      }
      <button onClick={handleGoBack} className="absolute z-50 translate-y-[3.2rem]">
        <GoBackButton />
      </button>
      <div className="flex flex-col pt-5 px-7 pb-10 gap-10 mt-[6rem] w-full h-full shadow-md overflow-auto rounded-lg bg-white text-black scrollbar-thin">
        <h1 className="text-xl font-semibold text-[#272525]">Product Request</h1>
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
            <h1>Updated By:</h1>
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
        <div className="rounded-lg w-[70rem] mb-10 shrink-0 border-[1px] border-gray-100 overflow-auto scrollbar-thin">
          <table className="text-sm w-[69rem] text-left text-gray-500">
            <thead className="sticky top-0 bg-white">
              <tr className="text-xs text-gray-700 uppercase">
                <th scope="col" className="px-6 py-3">ID</th>
                <th scope="col" className="px-6 py-3">Product</th>
                <th scope="col" className="px-6 py-3">Size/Model</th>
                <th scope="col" className="px-6 py-3">Category</th>
                <th scope="col" className="px-6 py-3">Quantity</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Amount</th>
                <th scope="col" className="px-6 py-3">Total Amount</th>
                <th scope="col" className="px-6 py-3">Current Stock</th>
                <th scope="col" className="px-6 py-3">{requestFormData.status === "completed" ? "Stock Status" : "Expected Stock Status"}</th>
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
                  <td className={`px-6 py-5 font-semibold 
                    ${product.status === "available" ? "text-green-500"
                      : product.status === "unavailable" ? "text-red-500"
                        : product.status === "to be received" ? "text-blue-600"
                          : product.status === "delivered" ? "text-blue-600" : ""
                    }`}>
                    {product.status}
                  </td>
                  <td className="px-6 py-5">₱{product.amount.toLocaleString()}</td>
                  <td className="px-6 py-5">₱{product.total.toLocaleString()}</td>
                  <td className="px-6 py-5">{product.currentWarehouseStock}</td>
                  <td className={`px-6 py-5 font-semibold ${requestFormData.status !== "completed" && (product.status === "devliered" || product.status === "to be received") ? "hidden" : ""} ${requestFormData.status === "completed" ? getStatusColor(product.completeStockStatus) : getStatusColor(product.stockStatus)}`}>
                    {requestFormData.status === "completed" ? product.completeStockStatus : product.stockStatus}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-white">
                <td colSpan="7" className="px-6 py-4 font-semibold">TOTAL</td>
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

          {canDeliverRequest && (
            <button
              onClick={() => handleDeliverClick()}
              className={`${DeliverText === "unavailable" ? "bg-gray-400 pointer-events-none" : "bg-blue-400 hover:bg-blue-500"} capitalize transition-all text-white font-normal text-sm px-14 py-[.72rem] rounded-lg focus:outline-none focus:ring-2 focus:ring-green-50`}
            >
              {DeliverText}
            </button>
          )}
          {canRequestPurchase && (
            <button
              // onClick={() => }
              className={`bg-[#7ad0ac] text-white font-normal text-sm px-10 py-[.72rem] transition-all rounded-lg hover:bg-[#73c5a3] focus:outline-none focus:ring-2 focus:ring-green-50`}
            >
              Request for Purchase
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

        </div>
      </div>
    </div>
  );
};

export default AddStock;
