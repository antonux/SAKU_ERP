import { useState, useEffect } from "react";
import axios from "axios";

const useAllApprovedProducts = (po_id) => {
  const [allApproved, setAllApproved] = useState([]);

  useEffect(() => {
    if (!po_id) return;

    const fetchCheckedReceipts = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/purchase/all-checked/${po_id}`);
        setAllApproved(response.data.approved_products);
      } catch (err) {
        console.error("Error fetching checked delivery receipts:", err);
        setError(err.response?.data?.message || "An unexpected error occurred");
      } 
    };

    fetchCheckedReceipts();
  }, [po_id]);

  return { allApproved };
};

export default useAllApprovedProducts;
