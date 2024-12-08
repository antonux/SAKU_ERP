import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBackIosNew } from "react-icons/md";

const GoBackButton = () => {
  const navigate = useNavigate();

  return (
    <div
      // onClick={() => navigate(-1)} 
      className=" text-[#555555] hover:text-[#313131] px-4 py-2 rounded flex gap-2 items-center"
    >
      <MdArrowBackIosNew className='size-6'/>
      Back
    </div>
  );
};

export default GoBackButton;
