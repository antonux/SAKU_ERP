import { useState, useEffect } from 'react';
import axios from 'axios';

const useApprovedProducts = (dr_id, receipt_status) => {
  const [approvedProducts, setApprovedProducts] = useState([]);  // State to store the approved products
  const [error, setError] = useState(null);  // State to store any errors

  useEffect(() => {
    if (receipt_status === 'checked' && dr_id) {
      const fetchApprovedProducts = async () => {
        try {
          // Fetch approved products based on dr_id
          const response = await axios.get(`http://localhost:4000/api/purchase/approve/${dr_id}`);

          // Log the full response for debugging
          console.log("Fetched Approved Products:", response.data);

          // Check if approved_products exists and set the state
          if (response.data && response.data.approved_products) {
            setApprovedProducts(response.data.approved_products);  // Set the approved products
          } else {
            console.error('No approved products found in the response');
            setError('No approved products found');
          }
        } catch (err) {
          console.error("Error fetching approved products:", err);
          setError(err.message);  // Set the error state if the request fails
        }
      };

      // Call the fetch function when dr_id changes
      if (dr_id) {
        fetchApprovedProducts();
      }
    }
  }, [dr_id, receipt_status]);  // Depend on dr_id to re-fetch if it changes

  return { approvedProducts, error };
};

export default useApprovedProducts;
