import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const Suppliers = () => {
  const [supplierData, setSupplierData] = useState([]);

  useEffect(() => {
    const fetchSupplierData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/supplier');
        const sortedData = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setSupplierData(sortedData);
      } catch (err) {
        console.error('Error fetching supplier data:', err);
      }
    };
    fetchSupplierData();
  }, []);

  return (
    <div className='flex flex-col gap-4 h-screen pb-5'>
      <div className="px-10 py-6 mt-[6rem] flex flex-col md:flex-row gap-4 flex-shrink-0 w-full shadow-md rounded-lg bg-white text-black">
        <div className="flex-1 space-y-2">
          <h2 className="text-sm font-medium">Quick search a Supplier</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Enter search word"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7ad0ac]"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-center px-6 py-2 bg-gray-50 rounded-lg">
            <p className="text-3xl font-semibold">{supplierData.length}</p>
            <p className="text-sm text-gray-500">Total Suppliers</p>
          </div>

          <div className="text-center px-6 py-2 bg-gray-50 rounded-lg">
            <p className="text-3xl font-semibold">0</p>
            <p className="text-sm text-gray-500">Inactive Suppliers</p>
          </div>
          <Link to="/suppliers/add-supplier">
            <button className="bg-[#7ad0ac] text-white px-6 py-2 rounded-full hover:bg-[#71c2a0] focus:outline-none focus:ring-2 focus:ring-green-50">
              New Supplier
            </button>
          </Link>
        </div>
      </div>

      <div className="rounded-lg shadow-md overflow-auto scrollbar-thin">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className='sticky top-0'>
            <tr>
              <th colSpan="9" className="px-6 py-3 bg-white text-lg font-medium text-[#080d1c] text-start">
                All Supplier
              </th>
            </tr>
            <tr className="text-xs text-gray-700 uppercase bg-white">
              <th scope="col" className="px-6 py-3">Image</th>
              <th scope="col" className="px-6 py-3">Company Name</th>
              <th scope="col" className="px-6 py-3">Address</th>
              <th scope="col" className="px-6 py-3">Contact Person</th>
              <th scope="col" className="px-6 py-3">Email</th>
              <th scope="col" className="px-6 py-3">Phone Number</th>
              <th scope="col" className="px-6 py-3">Product Offered</th>
              <th scope="col" className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {supplierData.map((supplier) => (
              <tr
                key={supplier.supplier_id}
                className="bg-white border-b hover:bg-gray-50"
              >
                <td className="px-6 py-3">
                  <source srcSet={`http://localhost:4000${supplier.image}?quality=50`} type="image/jpeg" />
                  <img
                    src={supplier.image? `http://localhost:4000${supplier.image}` : "/images/products/user.jpg"}
                    alt="images/products/tire.jpg"
                    className="size-10 object-cover"
                  />
                </td>
                <td className="px-6 py-4">{supplier.company_name}</td>
                <td className="px-6 py-4">{supplier.address}</td>
                <td className="px-6 py-4">{supplier.contact_name}</td>
                <td className="px-6 py-4">{supplier.email}</td>
                <td className="px-6 py-4">{supplier.phone}</td>
                <td className="px-6 py-4">{supplier.product_types.join(', ')}</td>
                <td className="px-6 py-4">
                  <Link
                    to="/suppliers/view-supplier"
                    state={{ supplier }}
                  >
                    <button className="text-blue-500 hover:underline">
                      View more
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Suppliers;

