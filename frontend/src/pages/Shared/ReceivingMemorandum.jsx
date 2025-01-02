
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
import CheckedProductPurchase from "../../modals/CheckedProductPurchase";

// Hooks
import usePurchaseData from '../../hooks/usePurchaseData';
import useStatusColor from '../../hooks/useStatusColor';
import useApprovedProducts from '../../hooks/useApprovedProducts';
import useDeliveryReceipts from '../../hooks/useDeliveryReceipts';
import useLatestReceipt from '../../hooks/useLatestReceipt';
import useAllApprovedProducts from '../../hooks/useAllApprovedProducts';

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
  const [showCheckedModal, setShowCheckedModal] = useState(false);
  const [receivedDelivery, setReceivedDelivery] = useState(false);
  const { item, isSuccess: isChecked, dr_id: receipt_id } = location.state || false;
  const [requestFormData, setRequestFormData] = useState(item)
  const [allReceipts, setAllReceipts] = useState([]); // All fetched receipts
  const [filteredReceipts, setFilteredReceipts] = useState([]); // Receipts filtered by po_id
  const [receivingMemo, setReceivingMemo] = useState([]);
  //hooks
  const { allApproved } = useAllApprovedProducts(requestFormData.po_id);
  // const { allReceipts } = useDeliveryReceipts();
  // const receipt = useLatestReceipt(allReceipts, requestFormData.po_id);

  const receipt = filteredReceipts.length > 0
    ? filteredReceipts.reduce((latest, current) =>
      new Date(current.updated_at) > new Date(latest.updated_at) ? current : latest
    )
    : "";

  const { approvedProducts } = useApprovedProducts(receipt.id, receipt.status);

  useEffect(() => {
    if (location.pathname !== "/purchase") {
      localStorage.setItem("lastRequestPath", location.pathname);
    }
    fetchDeliveryReceipts(); // Fetch receipts on mount
    if (isChecked) {
      setRefreshKey(prevKey => prevKey + 1);
      setShowCheckedModal(true);
    }
  }, []);

 

  useEffect(() => {
    // Filter receipts based on po_id whenever allReceipts or po_id changes
    const filtered = allReceipts.filter((receipt) => receipt.po_id === requestFormData.po_id);
    setFilteredReceipts(filtered);
  }, [allReceipts]);

  const fetchDeliveryReceipts = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/purchase/receive');
      setAllReceipts(response.data.receipts); // Populate allReceipts with API data
    } catch (error) {
      console.error('Error fetching delivery receipts:', error);
    }
  };

  const handleGoBack = () => {
    localStorage.setItem("lastPurchasePath", "/purchase/view-more");
    const lp = localStorage.getItem("lastPurchasePath")
    navigate(lp, { state: { item: requestFormData } }) 
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

  useEffect(() => {
  const fetchReceivingMemo = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/purchase/receiving-memo", {
        params: { po_id: requestFormData.po_id }, 
      });

      setReceivingMemo(response.data.data[0]);
    } catch (err) {
      console.error("Error fetching receiving memo:", err);
    }
  };

  if (requestFormData.po_id) {
    fetchReceivingMemo();
  }
}, [requestFormData.po_id]);




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
  }, [showApproveModal, showCancelModal, showAcknowledeModal, receivedDelivery, item, showCheckedModal])

  const hasDelivered = products.some((product) => product.status === "delivered");

  const canViewAR = hasDelivered;

  const hasUnavailable = products.some((product) => product.status === "unavailable");
  const hasAvailable = products.some((product) => product.status === "available");
  const hasPending = products.some((product) => product.status === "pending");
  const hasApproved = products.some((product) => product.status === "approved");

  const canViewMemo = (user === "admin" || user === "warehouse") && (hasPending || hasApproved)

  const showStatus = requestFormData.status === "pending" || requestFormData.status === "approved" || requestFormData.status === "cancelled" || hasAvailable || hasUnavailable;
  const showApproved = hasApproved || hasPending;

  const getApprovedQuantity = (productId) => {
    const approved = allApproved.find(p => p.product_id === productId);
    return approved ? approved.quantity : 0;
  };

  return (
    <div className='flex flex-col gap-4 h-screen pb-5 pt-7'>
      <button onClick={handleGoBack} className="absolute z-50 translate-y-[3.2rem]">
        <GoBackButton />
      </button>
      <div className="flex flex-col pt-5 px-7 pb-10 gap-10 mt-[6rem] w-full h-full shadow-md overflow-auto rounded-lg bg-white text-black scrollbar-thin">
        <h1 className="text-xl font-semibold text-[#272525]">Receiving Memorandum</h1>
        <div className="flex gap-5 whitespace-nowrap">
          <div className="flex gap-1">
            <h1>Purchase Order No.:</h1>
            <h1 className="font-semibold capitalize">{requestFormData.po_id}</h1>
          </div>
          <div className="flex gap-1">
            <h1>Date Created:</h1>
            <h1 className="font-semibold">{requestFormData.createdAt.toLocaleDateString()}</h1>
          </div>
          <div className="flex gap-1">
            <h1>Status:</h1>
            <h1 className={`capitalize font-semibold ${getStatusColor(receivingMemo.status)}`
            }>
              {receivingMemo.status}
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
        <div className="rounded-lg w-[65rem] mb-10 shrink-0 border-[1px] border-gray-100 overflow-auto scrollbar-thin">
          <table className="text-sm w-[64rem] text-left text-gray-500">
            <thead className="sticky top-0 bg-white">
              <tr className="text-xs text-gray-700 uppercase">
                <th scope="col" className="px-6 py-3">ID</th>
                <th scope="col" className="px-6 py-3">Product</th>
                <th scope="col" className="px-6 py-3">Size/Model</th>
                <th scope="col" className="px-6 py-3">Category</th>
                <th scope="col" className="px-6 py-3">Quantity</th>
                <th scope="col" className="px-6 py-3">Received</th>
                <th scope="col" className="px-6 py-3">Remaining</th>
                <th scope="col" className="px-6 py-3">Unit Price</th>
                <th scope="col" className="px-6 py-3">Amount Paid</th>
                {/* <th scope="col" className={`${showApproved ? "" : "hidden"} px-6 py-3`}>Approved</th> */}
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
                  <td className="px-6 py-5">{getApprovedQuantity(product.id)}</td>
                  <td className="px-6 py-5">{product.quantity - getApprovedQuantity(product.id)}</td>
                  <td className="px-6 py-5">₱{product.amount.toLocaleString()}</td>
                  <td className="px-6 py-5">₱{product.amount * getApprovedQuantity(product.id)}</td>
                  {/* <td className={`${showApproved ? "" : "hidden"} px-6 py-5`}>
                    {receipt.status === "unchecked" ? "": getApprovedQuantity(product.id)} / {product.quantity}
                  </td> */}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-white">
                <td colSpan="8" className="px-6 py-4 font-semibold">TOTAL</td>
                <td className="px-6 py-5 font-semibold">
                  ₱
                  {products
                    .reduce(
                      (total, product) =>
                        total + getApprovedQuantity(product.id) * product.amount,
                      0
                    )
                    .toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="flex gap-7">
        </div>
      </div>
    </div>
  );
};

export default PurchaseViewMore;
