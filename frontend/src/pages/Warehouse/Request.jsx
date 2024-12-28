
import Boxes from "../../components/Shared/requestBoxesRestock";
import Table from "../../components/Shared/requestTable";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const Inventory = () => {
  const navigate = useNavigate();

  // useEffect(() => {
  //   const lastPath = localStorage.getItem("lastRequestPath");
  //   if (lastPath !== "/request") {
  //     navigate(lastPath);
  //   }
  // }, []);

  return (
    <div className='flex flex-col gap-4 h-screen pb-5'>
      <div className="px-10 py-[0.7rem] items-center mt-[6rem] flex-shrink-0 w-full h-[8rem] shadow-md overflow-auto rounded-lg bg-white text-black scrollbar-thin">
        <Boxes />
      </div>

      <div className="px-10 py-3 flex shrink-0 h-[5rem] justify-between items-center w-full shadow-md overflow-auto rounded-lg bg-white text-black scrollbar-thin">
        <h1 className='text-2xl font-semibold'>
          Create a request
        </h1>
        <Link to="/request/purchase-request">
          <button className="bg-[#7ad0ac] text-white px-10 py-3 rounded-xl hover:bg-[#71c2a0] focus:outline-none focus:ring-2 focus:ring-green-50">
            Create a Purchase Request
          </button>
        </Link>
      </div>

      {/* table */}
      <Table />
      {/* table */}

    </div>
  );
};

export default Inventory;
