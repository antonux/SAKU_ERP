import { useNavigate } from 'react-router-dom';
import GoBackButton from "../../components/buttons/Backbutton";
import Boxes from "../../components/Admin/inventoryBoxes";

const Inventory = () => {
  const testData = new Array(10).fill({
    image: "https://via.placeholder.com/50",
    name: "Product Name",
    category: "Category",
    unitPrice: "$100",
    totalAmount: "$500",
    quantity: 5,
    status: "In Stock",
    action: "View",
  });
  return (
    <div className='flex flex-col gap-4 h-screen pb-5'>
      <div className="px-10 py-6 mt-[6rem] flex-shrink-0 w-full h-[10rem] shadow-md overflow-auto rounded-lg bg-white text-black scrollbar-thin">
        <Boxes />
      </div>
      <div className="px-10 py-3 flex shrink-0 h-[5rem] justify-between items-center w-full shadow-md overflow-auto rounded-lg bg-white text-black scrollbar-thin">
        <h1 className='text-2xl font-semibold'>Create Stock List</h1>
        <button className="bg-[#7ad0ac] text-white px-16 py-3 rounded-full hover:bg-[#71c2a0] focus:outline-none focus:ring-2 focus:ring-green-50">
          New Item
        </button>
      </div>

      <div className="rounded-lg shadow-md overflow-auto scrollbar-thin">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className='sticky top-0'>
            <tr>
              <th colSpan="9" className="px-6 py-3 bg-white text-lg font-medium text-[#080d1c] text-start">
                Product Inventory
              </th>
            </tr>
            <tr className="text-xs text-gray-700 uppercase bg-white">
              <th scope="col" className="px-6 py-3">Product Name</th>
              <th scope="col" className="px-6 py-3">Image</th>
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
                <td className="px-6 py-4">{item.name}</td>
                <td className="px-6 py-4">
                  <img
                    src={item.image}
                    alt="Product"
                    className="w-10 h-10"
                  />
                </td>
                <td className="px-6 py-4">{item.category}</td>
                <td className="px-6 py-4">{item.unitPrice}</td>
                <td className="px-6 py-4">{item.totalAmount}</td>
                <td className="px-6 py-4">{item.quantity}</td>
                <td className="px-6 py-4 text-green-500">
                  {item.status}
                </td>
                <td className="px-6 py-4">
                  <button className="text-blue-500 hover:underline">
                    {item.action}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

    </div>
  );
};

export default Inventory;
