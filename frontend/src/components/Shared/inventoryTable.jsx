import { useState, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import { Link } from "react-router-dom";
import axios from "axios";

// context
import { useRole } from "../../contexts/RoleContext";

const Table = () => {
  const [inventoryFilter, setInventoryFilter] = useState("all");
  const { user } = useRole();
  const role = user;
  const [productData, setProductData] = useState([]);
  console.log(productData)

  const inventoryFilterClass = (value) =>
    `px-4 font-normal rounded-full text-[#272525] ${inventoryFilter === value
      ? "border-[1px] border-black"
      : "border-[1px] border-transparent"
    } hover:border-gray-400 transition duration-200 ease-in-out`;

  useEffect(() => {
    const fetchSupplierData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/product');
        setProductData(response.data);
      } catch (err) {
        console.error('Error fetching product data:', err);
      }
    };
    fetchSupplierData();
  }, []);

  return (
    <div className="rounded-lg h-full bg-white shadow-md overflow-auto scrollbar-thin">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className='sticky top-0'>
          <tr className="text-xs text-gray-700 bg-white">
            <th colSpan="10" className="px-6 py-5">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-5">
                  <h1 className="text-xl font-semibold text-[#272525]">
                    {role === "store" ? "Store Stock List" : "Stock List"}
                  </h1>
                  <div className="relative ml-4"> {/* Add margin for spacing */}
                    <IoIosSearch className="absolute size-5 left-2 top-1/2 transform -translate-y-1/2 text-[#2a2929]" /> {/* Position the icon */}
                    <input
                      type="text"
                      placeholder="Search..."
                      className="text-[#121212] font-sans text-[15px] pl-8 pr-2 h-10 w-[180px] font-light outline-none bg-transparent border-b border-gray-400 transition-all duration-500 focus:outline-none focus:border-b-2 focus:border-gray-400 focus:w-[220px]"
                    />
                  </div>
                </div>
                <div className={`flex text-sm space-x-2 gap-2 text-center pr-12 cursor-pointer ${role == "store" ? "hidden" : ""}`}>
                  <h1 className="font-normal text-[#272525] cursor-default">
                    Location:
                  </h1>
                  <h1 className={inventoryFilterClass("all")}
                    onClick={() => setInventoryFilter("all")}>
                    All
                  </h1>
                  <h1 className={inventoryFilterClass("store")}
                    onClick={() => setInventoryFilter("store")}>
                    Store
                  </h1>
                  <h1 className={inventoryFilterClass("warehouse")}
                    onClick={() => setInventoryFilter("warehouse")}>
                    Warehouse
                  </h1>
                </div>
              </div>
            </th>
          </tr>
          <tr className="text-xs text-gray-700 uppercase bg-white">
            <th scope="col" className="px-6 py-3">Image</th>
            <th scope="col" className="px-6 py-3">Product Name</th>
            <th scope="col" className="px-6 py-3">Size/Model</th>
            <th scope="col" className="px-6 py-3">Category</th>
            <th scope="col" className="px-6 py-3">Unit Price</th>
            <th scope="col" className="px-6 py-3">Total Amount</th>
            <th scope="col" className="px-6 py-3">Location</th>
            <th scope="col" className="px-6 py-3">Quantity</th>
            <th scope="col" className="px-6 py-3">Status</th>
            <th scope="col" className={`px-6 py-3 ${role == "store" ? "hidden" : ""}`}>Action</th>
          </tr>
        </thead>
        <tbody>

          {productData.map((item) => {
            // Filter location_quantity based on inventoryFilter value
            const filteredLocations =
              inventoryFilter === "all"
                ? item.location_quantity // Show all locations
                : item.location_quantity.filter(
                  (location) => location.location === inventoryFilter // Filter by store or warehouse
                );

            return filteredLocations.map((location, locIndex) => {
              // Calculate status based on reorder_level
              const quantity = parseInt(location.quantity, 10) || 0; // Current location quantity
              const unitPrice = parseFloat(item.unit_price) || 0; // Unit price
              const reorderLevel = parseInt(item.reorder_level, 10) || 0; // Reorder level
              const totalAmount = (quantity * unitPrice).toFixed(2); // Calculate total amount

              let status = "Out of Stock";
              let statusColor = "text-red-500"; // Default color: red (Out of Stock)

              if (quantity === 0) {
                status = "Out of Stock";
                statusColor = "text-red-600";
              } else if (quantity <= reorderLevel + 5) {
                status = "Low Stock";
                statusColor = "text-orange-400";
              } else if (quantity > reorderLevel + 5) {
                status = "In Stock";
                statusColor = "text-green-500";
              }
              return (
                <tr key={`${item.prod_id}-${locIndex}`} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-3">
                    <img
                      src={`http://localhost:4000${item.image}`}
                      alt="Product"
                      className="size-10 object-cover"
                    />
                  </td>
                  <td className="px-6 py-3">{item.name}</td>
                  <td className="px-6 py-3">{item.size}</td>
                  <td className="px-6 py-3">{item.type}</td>
                  <td className="px-6 py-3">{item.unit_price}</td>
                  <td className="px-6 py-3">{totalAmount}</td>
                  <td className="px-6 py-3">{location.location}</td>
                  <td className="px-6 py-3">{location.quantity || "0"}</td>
                  <td className={`px-6 py-3 ${statusColor}`}>{status}</td>
                  <td className={`px-6 py-4 ${role === "store" ? "hidden" : ""}`}>
                    <Link to="/inventory/view-stock" state={{ item, location }}>
                      <button className="text-blue-500 hover:underline">View</button>
                    </Link>
                  </td>
                </tr>
              );
            });
          })}
        </tbody>
      </table>

    </div>

  )
}

export default Table;