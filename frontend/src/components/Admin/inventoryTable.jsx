import { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { Link } from "react-router-dom";

const Table = () => {
  const [inventoryFilter, setInventoryFilter] = useState("All");
  const inventoryFilterClass = (value) =>
    `px-4 font-normal rounded-full text-[#272525] ${inventoryFilter === value
      ? "border-[1px] border-black"
      : "border-[1px] border-transparent"
    } hover:border-gray-400 transition duration-200 ease-in-out`;


  const testData = new Array(10).fill({
    image: "/images/products/tire.jpg",
    size_model: "155R12",
    name: "Product Name",
    category: "Category",
    unitPrice: "$100",
    totalAmount: "$500",
    quantity: 5,
    status: "In Stock",
    action: "View",
  });
  return (
    <div className="rounded-lg shadow-md overflow-auto scrollbar-thin">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className='sticky top-0'>
          <tr className="text-xs text-gray-700 bg-white">
            <th colSpan="9" className="px-6 py-5">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-5">
                  <h1 className="text-xl font-semibold text-[#272525]">
                    Stock List
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
                <div className="flex text-sm space-x-2 gap-2 text-center pr-12 cursor-pointer">
                  <h1 className="font-normal text-[#272525] cursor-default">
                    Location:
                  </h1>
                  <h1 className={inventoryFilterClass("All")}
                    onClick={() => setInventoryFilter("All")}>
                    All
                  </h1>
                  <h1 className={inventoryFilterClass("Store")}
                    onClick={() => setInventoryFilter("Store")}>
                    Store
                  </h1>
                  <h1 className={inventoryFilterClass("Warehouse")}
                    onClick={() => setInventoryFilter("Warehouse")}>
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
            <th scope="col" className="px-6 py-3">Quantity</th>
            <th scope="col" className="px-6 py-3">Status</th>
            <th scope="col" className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {testData.map((item, index) => (
            <tr
              key={index}
              className="bg-white border-b hover:bg-gray-50"
            >
              <td className="px-6 py-3">
                <source srcSet={`${item.image}?quality=50`} type="image/jpeg" />
                <img
                  src={item.image}
                  alt="Product"
                  className="size-10 object-cover"
                />
              </td>
              <td className="px-6 py-3">{item.name}</td>
              <td className="px-6 py-3">{item.size_model}</td>
              <td className="px-6 py-3">{item.category}</td>
              <td className="px-6 py-3">{item.unitPrice}</td>
              <td className="px-6 py-3">{item.totalAmount}</td>
              <td className="px-6 py-3">{item.quantity}</td>
              <td className="px-6 py-3 text-green-500">
                {item.status}
              </td>
              <td className="px-6 py-4">
                <Link to="/admin/inventory/view-stock">
                  <button className="text-blue-500 hover:underline">
                    {item.action}
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>

  )
}

export default Table;