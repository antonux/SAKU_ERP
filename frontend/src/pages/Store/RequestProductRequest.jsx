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
        <h1 className="text-xl font-semibold text-[#272525]">Product Request Form</h1>
        <div className="flex gap-5 whitespace-nowrap items-center">
          <div className="w-[20rem]">
            <label htmlFor="product" className="block text-sm font-medium text-gray-700">Product</label>
            <input
              type="text"
              id="product"
              placeholder="Choose product"
              className="mt-1 block w-full px-3 py-3 text-center text-sm border border-gray-300 rounded-xl shadow-sm focus:outline-none"
            />
          </div>
          <div className="w-[20rem]">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              min="1"
              id="quantity"
              placeholder="Enter quantity"
              className="mt-1 block w-full px-3 py-3 text-center text-sm border border-gray-300 rounded-xl shadow-sm focus:outline-none"
            />
          </div>
          <div className="w-[15rem] ml-5 mt-5">
            <button className="bg-[#7ad0ac] text-white px-8 py-[0.65rem] rounded-xl hover:bg-[#71c2a0] focus:outline-none focus:ring-2 focus:ring-green-50">
              Add Product
            </button>
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
            <button className="bg-[#7ad0ac] text-white font-light text-base px-12 py-[0.62rem] rounded-xl hover:bg-[#78cca9] focus:outline-none focus:ring-2 focus:ring-green-50">
              Approve
            </button>
          }
          {user == "store" &&
            <button className="bg-[#7fd6b2] text-white font-light text-base px-12 py-[0.62rem] rounded-xl hover:bg-[#71c2a0] focus:outline-none focus:ring-2 focus:ring-green-50">
              Submit
            </button>
          }
        </div>
      </div>
    </div>
  );
};

export default AddStock;
