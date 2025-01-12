import axios from "axios";
import { useState, useEffect } from "react";

// contexts
import { useRole } from "../../contexts/RoleContext";

const Boxes = () => {
  const [productData, setProductData] = useState([]);

  // contexts
  const { user, userID } = useRole();

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/product");
        setProductData(response.data);
      } catch (err) {
        console.error("Error fetching product data:", err);
      }
    };
    fetchProductData();
  }, []);

  // Initialize counters
  let totalItems = 0;
  let totalItemCost = 0;
  let lowStockCount = 0;
  let outOfStockCount = 0;

  productData.forEach((item) => {
    // Iterate over all locations (store, warehouse, etc.)
    item.location_quantity.forEach((location) => {
      const quantity = parseInt(location.quantity, 10) || 0; // Current location quantity
      const unitPrice = parseFloat(item.unit_price) || 0; // Unit price
      const reorderLevel = parseInt(item.reorder_level, 10) || 0; // Reorder level

      // Check if the user is either "store" or "manager"
      if (user === "store" || user === "manager") {
        // Only consider "store" location for "store" or "manager" user roles
        if (location.location === "store") {
          // Determine stock status
          let status = "Out of Stock";
          let statusColor = "text-red-500"; // Default color: red (Out of Stock)

          if (quantity === 0) {
            status = "Out of Stock";
            statusColor = "text-red-600";
            outOfStockCount++; // Increase out of stock count
          } else if (quantity <= reorderLevel + 5) {
            status = "Low Stock";
            statusColor = "text-orange-400";
            lowStockCount++; // Increase low stock count
          } else {
            status = "In Stock";
          }

          // Update the counters for total items and total cost
          totalItems += quantity;
          totalItemCost += quantity * unitPrice;
        }
      } else {
        // If the user is not "store" or "manager", include all locations
        // Determine stock status
        let status = "Out of Stock";
        let statusColor = "text-red-500"; // Default color: red (Out of Stock)

        if (quantity === 0) {
          status = "Out of Stock";
          statusColor = "text-red-600";
          outOfStockCount++; // Increase out of stock count
        } else if (quantity <= reorderLevel + 5) {
          status = "Low Stock";
          statusColor = "text-orange-400";
          lowStockCount++; // Increase low stock count
        } else {
          status = "In Stock";
        }

        // Update the counters for total items and total cost
        totalItems += quantity;
        totalItemCost += quantity * unitPrice;
      }
    });
  });
  return (
    <div className="flex w-full gap-3">
      {/* Categories */}
      <div className="BOX1 flex flex-col gap-3 font-medium w-full">
        <div className="bg-[#f8f6f2] flex flex-col gap-1 p-5 rounded-lg border-[1px] border-[#eaf0f2]">
          <p>Categories</p>
          <h1 className="text-3xl font-medium tracking-wide text-[#373737]">
            3
          </h1>
        </div>
      </div>

      {/* Total Items */}
      <div className="BOX1 flex flex-col gap-3 w-full">
        <div className="bg-[#eff8fa] flex flex-col gap-1 p-5 rounded-lg border-[1px] border-[#eaf0f2]">
          <p>Total Items</p>
          <h1 className="text-3xl font-medium tracking-wide text-[#373737]">
            {totalItems}
          </h1>
        </div>
      </div>

      {/* Total Item Cost */}
      <div className="BOX1 flex flex-col gap-3 w-full">
        <div className="bg-[#eff8fa] flex flex-col gap-1 p-5 rounded-lg border-[1px] border-[#eaf0f2]">
          <p>Total Item Cost</p>
          <h1 className="text-3xl font-medium tracking-wide text-[#373737]">
            ₱{totalItemCost.toLocaleString()}
          </h1>
        </div>
      </div>

      {/* Low Stock */}
      <div className="BOX1 flex gap-3">
        <div className="bg-[#eff8fa] flex flex-col gap-1 p-4 w-[8.5rem] rounded-lg border-[1px] border-[#eaf0f2]">
          <p>Low Stock</p>
          <h1 className="text-3xl font-medium tracking-wide text-[#f29425]">
            {lowStockCount}
          </h1>
        </div>

        {/* Out of Stock */}
        <div className="bg-[#eff8fa] flex flex-col gap-1 p-4 w-[8.5rem] rounded-lg border-[1px] border-[#eaf0f2]">
          <p>Out of Stock</p>
          <h1 className="text-3xl font-medium tracking-wide text-[#ef4c50]">
            {outOfStockCount}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Boxes;
