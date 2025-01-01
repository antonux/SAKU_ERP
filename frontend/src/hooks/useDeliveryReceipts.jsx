import { useState, useEffect } from 'react';
import axios from 'axios';

const useDeliveryReceipts = () => {
  const [allReceipts, setAllReceipts] = useState([]);

  useEffect(() => {
    const fetchDeliveryReceipts = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/purchase/receive');
        const data = response.data.receipts;
        setAllReceipts(data);
      } catch (error) {
        console.error('Error fetching delivery receipts:', error);
      }
    };

    fetchDeliveryReceipts();
  }, []);

  // Log allReceipts after it changes
  useEffect(() => {
    // console.log('fetched delivery receipts:', allReceipts);
  }, [allReceipts]);

  return { allReceipts };
};

export default useDeliveryReceipts;
