

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
import ReceiveDeliveryModal from "../../modals/receiveDelivery";

import ViewDrModal from "../../components/Warehouse/viewDrModal";
import ApproveProductModal from "../../modals/ApproveProduct";

// Hooks
import usePurchaseData from '../../hooks/usePurchaseData';
import useStatusColor from '../../hooks/useStatusColor';

// axios
import axios from "axios";

const DeliveryReceiptCheck = () => {
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
  const { item, receipt } = location.state;
  const [requestFormData, setRequestFormData] = useState(item)
  // approve product
  const [showApproveProductModal, setShowApproveProductModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedProductQuantity, setSelectedProductQuantity] = useState(0);
  const [quantities, setQuantities] = useState({}); // Store quantities by productId 


  useEffect(() => {
    if (location.pathname !== "/purchase") {
      localStorage.setItem("lastRequestPath", location.pathname);
    }
  }, []);

  const handleGoBack = () => {
    localStorage.setItem("lastPurchasePath", "/purchase/view-more");
    const lp = localStorage.getItem("lastPurchasePath")
    navigate(lp, { state: { item: item } });
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

  const submitDeliveryReceiptCheck = async () => {
    try {
      const requestData = {
        rf_id: requestFormData.rf_id,
        po_id: requestFormData.po_id,
        user_id: userID,
        status: "received"
      };

      const response = await axios.post('http://localhost:4000/api/purchase/create/receive', requestData);
      console.log('Purchase received:', response.data);

      setRefreshKey(prevKey => prevKey + 1);
      setTimeout(() => {
        setReceivedDelivery(true);
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

  const canSubmitProductChecking = (user === "warehouse");

  const canAcknowledgeRequest =
    (user === "store" || user === "manager") &&
    (requestFormData.status === "to be received");

  const canViewDR =
    user === "warehouse" && (requestFormData.status !== "pending" && requestFormData.status !== "cancelled" && requestFormData.status !== "approved");

  const hasDelivered = products.some((product) => product.status === "delivered");

  const canViewAR = hasDelivered;

  const hasUnavailable = products.some((product) => product.status === "unavailable");
  const hasAvailable = products.some((product) => product.status === "available");

  const showStatus = false

  const handleOpenModal = (productId, quantity) => {
    setSelectedProductId(productId);
    setSelectedProductQuantity(quantity);
    setShowApproveProductModal(true);
  };

  const handleSetNewQuantity = (productId, newQuantity) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: newQuantity, // Update the specific product's quantity
    }));
  };


  return (
    <div className='flex flex-col gap-4 h-screen pb-5 pt-7'>
      {showApproveProductModal && (
        <ApproveProductModal
          onClose={() => setShowApproveProductModal(false)}
          newQuantity={quantities[selectedProductId] || ""}
          setNewQuantity={handleSetNewQuantity}
          selectedProductQuantity={selectedProductQuantity}
          productId={selectedProductId} // Pass the selected productId
        />
      )}
      <button onClick={handleGoBack} className="absolute z-50 translate-y-[3.2rem]">
        <GoBackButton />
      </button>
      <div className="flex flex-col pt-5 px-7 pb-10 gap-10 mt-[6rem] w-full h-full shadow-md overflow-auto rounded-lg bg-white text-black scrollbar-thin">
        <h1 className="text-xl font-semibold text-[#272525]">Delivery Receipt {`#${receipt.id}`}</h1>
        <div className="flex gap-5 whitespace-nowrap">
          <div className="flex gap-1">
            <h1>Purchase Order No.:</h1>
            <h1 className="font-semibold capitalize">{requestFormData.po_id}</h1>
          </div>
          <div className="flex gap-1">
            <h1>Requested By:</h1>
            <h1 className="font-semibold capitalize">{requestFormData.requestedBy}</h1>
          </div>
          <div className="flex gap-1">
            <h1>Date Created:</h1>
            <h1 className="font-semibold">{requestFormData.createdAt.toLocaleDateString()}</h1>
          </div>
          <div className={`${receipt.status === "unchecked" ? "hidden" : "flex"} gap-1`}>
            <h1>Updated By:</h1>
            <h1 className="font-semibold capitalize">{requestFormData.updatedBy || "—"}</h1>
          </div>
          <div className="flex gap-1">
            <h1>Status:</h1>
            <h1 className={`capitalize font-semibold ${getStatusColor(receipt.status)}`
            }>
              {receipt.status}
            </h1>
          </div>
        </div>
        <div>
          <div className="flex gap-1">
            <h1>Supplier:</h1>
            <h1 className="font-semibold capitalize">{requestFormData.supplier}</h1>
          </div>
        </div>
        <div className="rounded-lg w-[71rem] mb-10 shrink-0 border-[1px] border-gray-100 overflow-auto scrollbar-thin">
          <table className="text-sm w-[70rem] text-left text-gray-500">
            <thead className="sticky top-0 bg-white">
              <tr className="text-xs text-gray-700 uppercase">
                <th scope="col" className="px-6 py-3">ID</th>
                <th scope="col" className="px-6 py-3">Product</th>
                <th scope="col" className="px-6 py-3">Size/Model</th>
                <th scope="col" className="px-6 py-3">Category</th>
                <th scope="col" className="px-6 py-3">Quantity</th>
                <th scope="col" className="px-6 py-3">Amount</th>
                <th scope="col" className="px-6 py-3">Total Amount</th>
                {/* <th scope="col" className={`px-6 py-3 ${showStatus ? "hidden" : ""}`}>Status</th> */}
                <th scope="col" className="px-6 py-3">Approved</th>
                <th scope="col" className="text-center px-6 py-3">Action</th>
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
                  <td className="px-6 py-5">
                    {quantities[product.id]} / {product.quantity}
                  </td>
                  <td className={`${showStatus ? "hidden" : ""} px-6 py-5 text-center font-semibold`}>
                    <button
                      className="px-4 py-2 rounded-md text-white transition-all bg-green-400 hover:bg-green-500/90"
                      onClick={() => handleOpenModal(product.id, product.quantity)}
                    >
                      Approve
                    </button>
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
          {canSubmitProductChecking && (
            <button
              // onClick={() => handleApproveClick()}
              className="bg-[#7fd6b2] text-white disabled:bg-gray-300 disabled:pointer-events-none font-normal text-sm px-20 py-[.72rem] rounded-lg hover:bg-[#71c2a0] focus:outline-none focus:ring-2 focus:ring-green-50"
              disabled={
                !products.every((product) => quantities[product.id])
              }
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryReceiptCheck;
