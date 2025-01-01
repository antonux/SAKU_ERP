import { useState, useEffect } from 'react';
import axios from 'axios';

const useRecentReceipt = (po_id, dr_id) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentReceipt, setRecentReceipt] = useState(null);
  const [approvedProducts, setApprovedProducts] = useState([]);

  useEffect(() => {
    const fetchRecentReceipt = async () => {
      if (!po_id) return; // Exit if no poId is provided
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`http://localhost:4000/api/purchase/recent-receipt/${po_id}/${dr_id}`);
        setRecentReceipt(response.data.recent_checked_dr);
        setApprovedProducts(response.data.approved_products);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching recent receipt.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentReceipt();
  }, [po_id]);

  return { loading, error, recentReceipt, approvedProducts };
};

export default useRecentReceipt;
