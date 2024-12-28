import useRestockData from '../../hooks/useRestockData';
import { useEffect, useState } from 'react';

const Boxes = () => {
  const { restockData:data , error } = useRestockData();

  if (error) {
    return <p>Error fetching data: {error.message}</p>;
  }

   // Filter data to include only "restock" type
  const restockData = data.request_form.filter(
    (form) => form.type === "restock"
  );

  // Calculate values
  const totalRequests = restockData.length;
  
  const totalCost = restockData.reduce((sum, form) => {
    return sum + parseFloat(form.total_amount || 0); // Ensure numeric value
  }, 0);

  const approvedRequests = restockData.filter(
    (form) => form.status === "approved"
  ).length;

  const pendingRequests = restockData.filter(
    (form) => form.status === "pending"
  ).length;

  return (
    <div className='flex w-full justify-around gap-3'>
      {/* Categories ----------------------------------------------------- */}
      <div className="BOX1 flex flex-col gap-3 font-medium w-full">
        <div className="bg-[#f8f6f2] flex flex-col gap-1 p-5 rounded-lg border-[1px] border-[#eaf0f2]">
          <p>Total Requests Made</p>
          <h1 className='text-3xl font-medium tracking-wide text-[#373737]'>
            {totalRequests}
          </h1>
        </div>
      </div>
      <div className="BOX1 flex flex-col gap-3 w-full">
        <div className="bg-[#eff8fa] flex flex-col gap-1 p-5 rounded-lg border-[1px] border-[#eaf0f2]">
          <p>Total Cost Incurred</p>
          <h1 className='text-3xl font-medium tracking-wide text-[#373737]'>
            ₱{totalCost.toLocaleString()}
          </h1>
        </div>
      </div>
      <div className="BOX1 flex flex-col gap-3 w-full">
        <div className="bg-[#eff8fa] flex flex-col gap-1 p-5 rounded-lg border-[1px] border-[#eaf0f2]">
          <p>Approved Requests</p>
          <h1 className='text-3xl font-medium tracking-wide text-[#373737]'>
            {approvedRequests}
          </h1>
        </div>
      </div>
      <div className="BOX1 flex flex-col gap-3 w-full">
        <div className="bg-[#eff8fa] flex flex-col gap-1 p-5 rounded-lg border-[1px] border-[#eaf0f2]">
          <p>Pending Requests</p>
          <h1 className='text-3xl font-medium tracking-wide text-[#f3a140]'>
            {pendingRequests}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Boxes;
