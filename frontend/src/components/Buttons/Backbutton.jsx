import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBackIosNew } from "react-icons/md";

const GoBackButton = () => {
  const navigate = useNavigate();

  return (
    <button 
      onClick={() => navigate(-1)} 
      className=" text-[#238b45] px-4 py-2 rounded flex gap-2 items-center"
    >
      <MdArrowBackIosNew className='size-6'/>
      Back
    </button>
  );
};

export default GoBackButton;
