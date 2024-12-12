import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

// Components
import GoBackButton from "../../components/buttons/Backbutton";

// Context
import { useRole } from "../../contexts/RoleContext";

const AddStock = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useRole();

  useEffect(() => {
    if (location.pathname !== "/request") {
      localStorage.setItem("lastRequestPath", location.pathname);
    }
  }, []);

  const handleGoBack = () => {
    localStorage.setItem("lastRequestPath", "/request");
    const lp = localStorage.getItem("lastRequestPath")
    navigate(lp)
  };

  const products = [
    { id: 1, product: "Engine Oil", size: "1L", category: "Oil", quantity: 5, amount: 300, total: 1500 },
    { id: 2, product: "Car Tire", size: "R15", category: "Tire", quantity: 2, amount: 3500, total: 7000 },
    { id: 3, product: "Car Battery", size: "12V", category: "Battery", quantity: 1, amount: 5500, total: 5500 },
  ];
  const totalAmount = products.reduce((sum, product) => sum + product.total, 0);

  return (
    <div className='flex flex-col gap-4 h-screen pb-5 pt-7'>
      <button onClick={handleGoBack} className="absolute z-50 translate-y-[3.2rem]">
        <GoBackButton />
      </button>
      <div className="flex flex-col pt-5 px-7 pb-10 gap-10 mt-[6rem] w-full h-full shadow-md overflow-auto rounded-lg bg-white text-black scrollbar-thin">
        <h1 className="text-xl font-semibold text-[#272525]">Product Request</h1>
        <div className="flex gap-5 whitespace-nowrap">
          <div className="flex gap-1">
            <h1>Requested By:</h1>
            <h1 className="font-semibold">John Otto</h1>
          </div>
          <div className="flex gap-1">
            <h1>Date Created:</h1>
            <h1 className="font-semibold">11/22/2024</h1>
          </div>
          <div className="flex gap-1">
            <h1>Status:</h1>
            <h1 className="font-semibold text-[#f29425]">Pending</h1>
          </div>
          <div className="gap-1 hidden">
            <h1>Requested By:</h1>
            <h1 className="font-semibold">John Otto</h1>
          </div>
        </div>
        <div className="rounded-lg w-[56rem] mb-10 shrink-0 border-[1px] border-gray-100 overflow-auto scrollbar-thin">
          <table className="text-sm w-[55rem] text-left text-gray-500">
            <thead className="sticky top-0 bg-white">
              <tr className="text-xs text-gray-700 uppercase">
                <th scope="col" className="px-6 py-3">ID</th>
                <th scope="col" className="px-6 py-3">Product</th>
                <th scope="col" className="px-6 py-3">Size/Model</th>
                <th scope="col" className="px-6 py-3">Category</th>
                <th scope="col" className="px-6 py-3">Quantity</th>
                <th scope="col" className="px-6 py-3">Amount</th>
                <th scope="col" className="px-6 py-3">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-5">{product.id}</td>
                  <td className="px-6 py-5">{product.product}</td>
                  <td className="px-6 py-5">{product.size}</td>
                  <td className="px-6 py-5">{product.category}</td>
                  <td className="px-6 py-5">{product.quantity}</td>
                  <td className="px-6 py-5">₱{product.amount.toLocaleString()}</td>
                  <td className="px-6 py-5">₱{product.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-white">
                <td colSpan="6" className="px-6 py-4 font-semibold">TOTAL</td>
                <td className="px-6 py-5 font-semibold">₱{totalAmount.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div>
          {user !== "store" &&
            <button className="bg-[#7fd6b2] text-white font-normal text-sm px-20 py-[.72rem] rounded-lg hover:bg-[#71c2a0] focus:outline-none focus:ring-2 focus:ring-green-50">
              Approve
            </button>
          }
          {user == "store" &&
            <button className="bg-red-400 text-white font-normal text-sm px-20 py-[.72rem] rounded-lg hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-green-50">
              Cancel
            </button>
          }
        </div>
      </div>
    </div>
  );
};

export default AddStock;
