import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import { Link } from "react-router-dom";

import axios from "axios";

// Modals
import DeleteRequestSuccessful from "../../modals/DeleteRequestSuccessful";

const Table = () => {
  const location = useLocation();
  const { isSuccess: isDeleted, rf_id } = location.state || false;
  console.log(isDeleted)
  const [isRequestDeleted, setIsRequestDeleted] = useState(false);
  const [inventoryFilter, setInventoryFilter] = useState("All");
  const inventoryFilterClass = (value) =>
    `px-4 font-normal rounded-full text-[#272525] ${inventoryFilter === value
      ? "border-[1px] border-black"
      : "border-[1px] border-transparent"
    } hover:border-gray-400 transition duration-200 ease-in-out`;

  const [restockData, setRestockData] = useState({
    request_form: [],
    request_details: [],
    product: [],
    users: [],
  });

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
  }, []);

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
      .join(", "); // Join categories

    // Requested by user
    const requestedByUser = restockData.users.find((user) => user.user_id === form.requested_by);
    const requestedBy = requestedByUser
      ? `${requestedByUser.fname} ${requestedByUser.lname}`
      : "Unknown";

    // Approved by user
    const approvedByUser = restockData.users.find((user) => user.user_id === form.approved_by);
    const approvedBy = approvedByUser
      ? `${approvedByUser.fname} ${approvedByUser.lname}`
      : "";

    return {
      rf_id: form.rf_id,
      category: productCategory,
      totalQty,
      requestedBy,
      approvedBy,
      date: new Date(form.created_at).toLocaleDateString(),
      status: form.status,
      action: "View More",
    };
  });

  useEffect(() => {
    if (isDeleted) {
      setIsRequestDeleted(true)
    }
  },[isDeleted])

  const closeRequestDeletedModal = () => {
    setIsRequestDeleted(false);
  };


  return (
    <div className="rounded-lg h-full bg-white shadow-md overflow-auto scrollbar-thin">
      {isRequestDeleted &&
        <DeleteRequestSuccessful
          onClose={closeRequestDeletedModal}
          rf_id={rf_id}
        />
      }
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
          {mappedData.map((item, index) => (
          <tr key={index} className="bg-white border-b hover:bg-gray-50 capitalize">
            <td className="px-6 py-5">{index + 1}</td>
            <td className="px-6 py-5">{item.category}</td>
            <td className="px-6 py-5">{item.totalQty}</td>
            <td className="px-6 py-5">{item.requestedBy}</td>
            <td className="px-6 py-5">{item.approvedBy}</td>
            <td className="px-6 py-5">{item.date}</td>
            <td className="px-6 py-5 text-orange-400">{item.status}</td>
            <td className="px-6 py-5">
              <Link to="/request/view-more" state={{ item, restockData }}>
                <button className="text-blue-500 hover:underline">{item.action}</button>
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
