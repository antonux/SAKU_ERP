
import Boxes from "../../components/Shared/inventoryBoxes";
import Table from "../../components/Shared/inventoryTable";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const Inventory = () => {
  const navigate = useNavigate();

  // useEffect(() => {
  //   const lastPath = localStorage.getItem("lastInventoryPath");
  //   if (lastPath !== "/admin/inventory") {
  //     navigate(lastPath);
  //   }
  // }, []);



  return (
    <div className='flex flex-col gap-4 h-screen pb-5'>
      <div className="px-10 py-6 mt-[6rem] flex-shrink-0 w-full h-[10rem] shadow-md overflow-auto rounded-lg bg-white text-black scrollbar-thin">
        <Boxes />
      </div>

      {/* table */}
      <Table />
      {/* table */}

    </div>
  );
};

export default Inventory;
