import { useState, useEffect } from "react";
import axios from "axios";

const useRestockData = (refreshKey) => {
  const [restockData, setRestockData] = useState({
    request_form: [],
    request_details: [],
    product: [],
    inventory: [],
    users: [],
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/request/restock");
        setRestockData(response.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err);
      }
    };

    fetchData();
  }, [refreshKey]);

  // Mapping logic can be encapsulated here
  const mappedData = restockData.request_form.map((form) => {
    // Total quantity for this request
    const totalQty = restockData.request_details
      .filter((detail) => detail.rf_id === form.rf_id)
      .reduce((sum, detail) => sum + detail.quantity, 0);

    // Product category for this request
    const productCategory = restockData.request_details
      .filter((detail) => detail.rf_id === form.rf_id)
      .map((detail) => {
        const product = restockData.product.find((prod) => prod.prod_id === detail.product_id);
        return product ? product.type : "Unknown";
      })
      .join(", ");

    // Requested by user
    const requestedByUser = restockData.users.find((user) => user.user_id === form.requested_by);
    const requestedBy = requestedByUser
      ? `${requestedByUser.fname} ${requestedByUser.lname}`
      : "Unknown";

    // Approved by user
    const updatedByUser = restockData.users.find((user) => user.user_id === form.updated_by);
    const updatedBy = updatedByUser
      ? `${updatedByUser.fname} ${updatedByUser.lname}`
      : "";

    return {
      rf_id: form.rf_id,
      category: productCategory,
      totalQty,
      requestedBy,
      requestedByRole: requestedByUser.role,
      updatedBy,
      date: new Date(form.created_at), // Keep as Date object for sorting
      updatedAt: form.updated_at ? new Date(form.updated_at) : null, // Keep as Date object for sorting
      status: form.status,
      action: "View More",
    };
  });

  return { mappedData, error, restockData };
};

export default useRestockData;
