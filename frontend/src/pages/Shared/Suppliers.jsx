const Suppliers = () => {
  const supplierData = [
    {
      id: "01",
      companyName: "Motorite Batteries",
      address: "Mandaue City, Cebu",
      contactPerson: "David Mabahaw",
      email: "david@gmail.com",
      phoneNumber: "08180000000",
      role: "Manager",
      productOffered: "Battery",
    },
    {
      id: "02",
      companyName: "Goodyear Auto",
      address: "Mandaue City",
      contactPerson: "Max Fernando",
      email: "max@gmail.com",
      phoneNumber: "07062000033",
      role: "Sales Agent",
      productOffered: "Tire & Oil",
    },
    {
      id: "03",
      companyName: "Goodride Perf.",
      address: "Cebu City",
      contactPerson: "Dindo Go",
      email: "dindo@gmail.com",
      phoneNumber: "08130000000",
      role: "Sales Agent",
      productOffered: "Tire",
    },
    {
      id: "04",
      companyName: "Petron Corpor.",
      address: "Mandaue City",
      contactPerson: "Neil Naputo",
      email: "neil@gmail.com",
      phoneNumber: "07038126632",
      role: "Manager",
      productOffered: "Oil",
    },
  ];

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

          <button className="bg-[#7ad0ac] text-white px-6 py-2 rounded-full hover:bg-[#71c2a0] focus:outline-none focus:ring-2 focus:ring-green-50">
            New Supplier
          </button>
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
              <th scope="col" className="px-6 py-3">SN</th>
              <th scope="col" className="px-6 py-3">Company Name</th>
              <th scope="col" className="px-6 py-3">Address</th>
              <th scope="col" className="px-6 py-3">Contact Person</th>
              <th scope="col" className="px-6 py-3">Email</th>
              <th scope="col" className="px-6 py-3">Phone Number</th>
              <th scope="col" className="px-6 py-3">Role</th>
              <th scope="col" className="px-6 py-3">Product Offered</th>
              <th scope="col" className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {supplierData.map((supplier) => (
              <tr
                key={supplier.id}
                className="bg-white border-b hover:bg-gray-50"
              >
                <td className="px-6 py-4">{supplier.id}</td>
                <td className="px-6 py-4">{supplier.companyName}</td>
                <td className="px-6 py-4">{supplier.address}</td>
                <td className="px-6 py-4">{supplier.contactPerson}</td>
                <td className="px-6 py-4">{supplier.email}</td>
                <td className="px-6 py-4">{supplier.phoneNumber}</td>
                <td className="px-6 py-4">{supplier.role}</td>
                <td className="px-6 py-4">{supplier.productOffered}</td>
                <td className="px-6 py-4">
                  <button className="text-blue-500 hover:underline">
                    View more
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

export default Suppliers;

