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

  const testData = new Array(5).fill({
    category: "Category Name",
    totalQty: 50,
    requestedBy: "User A",
    approvedBy: "Manager B",
    date: "2024-12-08",
    status: "Pending",
    action: "View More",
  });

  return (
    <div className="rounded-lg h-full bg-white shadow-md overflow-auto scrollbar-thin">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="sticky top-0">
          <tr className="text-xs text-gray-700 bg-white">
            <th colSpan="8" className="px-6 py-5">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-5">
                  <h1 className="text-xl font-semibold text-[#272525]">
                    All Product Request
                  </h1>
                </div>
                <div className="flex text-sm items-center space-x-2 gap-2 text-center pr-12 cursor-pointer">
                  <h1 className="font-normal text-[#272525] cursor-default">
                    Filter Date:
                  </h1>
                  <input
                    type="date"
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm font-normal text-[#272525] focus:ring-2 focus:ring-gray-400 outline-none"
                  />
                </div>
              </div>
            </th>
          </tr>
          <tr className="text-xs text-gray-700 uppercase bg-white">
            <th scope="col" className="px-6 py-3">S/N</th>
            <th scope="col" className="px-6 py-3">Category</th>
            <th scope="col" className="px-6 py-3">Total Qty</th>
            <th scope="col" className="px-6 py-3">Requested By</th>
            <th scope="col" className="px-6 py-3">Approved By</th>
            <th scope="col" className="px-6 py-3">Date</th>
            <th scope="col" className="px-6 py-3">Status</th>
            <th scope="col" className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {testData.map((item, index) => (
            <tr key={index} className="bg-white border-b hover:bg-gray-50">
              <td className="px-6 py-5">{index + 1}</td>
              <td className="px-6 py-5">{item.category}</td>
              <td className="px-6 py-5">{item.totalQty}</td>
              <td className="px-6 py-5">{item.requestedBy}</td>
              <td className="px-6 py-5">{item.approvedBy}</td>
              <td className="px-6 py-5">{item.date}</td>
              <td className="px-6 py-5 text-orange-400">{item.status}</td>
              <td className="px-6 py-5">
                <Link to="/request/view-more">
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
  );
};

export default Table;
