import { useState, useEffect } from "react";
import axios from "axios";

const usepurchaseData = (refreshKey) => {
    const [purchaseData, setPurchaseData] = useState({
        purchase_order: [], // Purchase Order table
        request_form: [], // Request Form table
        request_details: [], // Request Details table
        product: [], // Product table
        users: [], // Users table
        suppliers: [], // Suppliers table

    });
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch data from your backend
                const response = await axios.get("http://localhost:4000/api/purchase/purchaseRequest");
                console.log("Fetched data:", response.data);
                setPurchaseData(response.data);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError(err);
            }
        };

        fetchData();
    }, [refreshKey]);

    // Mapping logic for purchase order data
    const mappedData = purchaseData.purchase_order.map((po) => {
        // Find the associated request form
        const requestForm = purchaseData.request_form.find((form) => form.rf_id === po.rf_id);

        // Total quantity for this purchase order
        const totalQty = purchaseData.request_details
            .filter((detail) => detail.rf_id === po.rf_id)
            .reduce((sum, detail) => sum + detail.quantity, 0);

        // Total amount for this purchase order
        const totalAmount = purchaseData.request_details
            .filter((detail) => detail.rf_id === po.rf_id)
            .reduce((sum, detail) => {
                const product = purchaseData.product.find((prod) => prod.prod_id === detail.product_id);
                const price = product ? product.unit_price || 0 : 0; // Ensure price is not undefined
                return sum + detail.quantity * price;
            }, 0);

        // Product category for this purchase order
        const productCategory = purchaseData.request_details
            .filter((detail) => detail.rf_id === po.rf_id)
            .map((detail) => {
                const product = purchaseData.product.find((prod) => prod.prod_id === detail.product_id);
                return product ? product.type : "—";
            })
            .join(", ");

        // Supplier
        const supplier = purchaseData.suppliers.find((supplier) => supplier.supplier_id === po.supplier);
        const supplierName = supplier ? supplier.company_name : "—";

        // Approved by user
        const approvedByUser = purchaseData.users.find((user) => user.user_id === po.approved_by);
        const approvedBy = approvedByUser
            ? `${approvedByUser.fname} ${approvedByUser.lname}`
            : "—";

        const updatedByUser = purchaseData.users.find((user) => user.user_id === requestForm.updated_by);
        const updatedBy = updatedByUser
            ? `${updatedByUser.fname} ${updatedByUser.lname}`
            : "";

        // Requested by user
        const requestedByUser = purchaseData.users.find(
            (user) => user.user_id === requestForm?.requested_by
        );
        const requestedBy = requestedByUser ? requestedByUser.role : "—"; // Requested by role

        return {
            po_id: po.po_id, // Purchase Order ID
            po_status: po.status, // Status of the purchase order
            createdAt: new Date(requestForm.created_at), // Created date
            updatedAt: requestForm.updated_at ? new Date(requestForm.updated_at) : null, // Updated date
            supplier: supplierName, // Supplier name
            approvedBy, // Approved by
            updatedBy,
            requestedBy, // Requested by role
            rf_id: po.rf_id,
            status: requestForm.status,
            totalQty, // Total quantity
            totalAmount, // Total amount
            productCategory, // Product categories
            action: "View More", // Action column for your UI
        };
    });

    return { mappedData, error, purchaseData };
};

export default usepurchaseData;
