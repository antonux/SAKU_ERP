
import { useState, useEffect } from 'react';

const useLatestReceipt = (allReceipts, po_id) => {
  const [filteredReceipts, setFilteredReceipts] = useState([]);

  useEffect(() => {
    // Filter receipts based on po_id
    const filtered = allReceipts.filter((receipt) => receipt.po_id === po_id);
    setFilteredReceipts(filtered);
  }, [allReceipts, po_id]);

  const latestReceipt = filteredReceipts.length > 0 
    ? filteredReceipts.reduce((latest, current) => 
        new Date(current.updated_at) > new Date(latest.updated_at) ? current : latest
      )
    : null;

  return latestReceipt;
};

export default useLatestReceipt;
