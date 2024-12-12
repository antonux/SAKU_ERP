import React, { useState, useEffect } from 'react';
import { IoIosArrowDown, IoIosApps } from 'react-icons/io';

const FloatingComponent = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Categories");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Ensure animation finishes before unmounting
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowDropdown(false);
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-25 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-white p-8 rounded-lg shadow-lg w-[50rem] h-[35rem] relative transition-transform duration-300 transform ${isVisible ? 'scale-100' : 'scale-90'}`}>
        <button
          className="absolute text-xl top-2 right-5 text-gray-600 hover:text-gray-800 focus:outline-none"
          onClick={handleClose}
        >
          ✖
        </button>

        {/* Header */}
        <div className="flex justify-start items-center mb-6 gap-8">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search (name, size, model)"
            className="w-[50%] px-4 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-[1px] focus:ring-gray-800"
          />

          {/* Categories Dropdown */}
          <div className="relative">
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <IoIosApps size={20} className="text-gray-900" />
              <span className="text-gray-700 font-medium">{selectedCategory}</span>
              <IoIosArrowDown size={18} className="text-gray-900" />
            </div>

            {showDropdown && (
              <div className="absolute z-50 right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg">
                {["Tire", "Oil", "Battery"].map((category) => (
                  <div
                    key={category}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleCategorySelect(category)}
                  >
                    {category}
                  </div>
                ))}
              </div>
            ) }
          </div>
        </div>

        {/* Grid Content */}
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="relative bg-white cursor-pointer border-[1px] border-[#c0d4cd] w-40 h-44 rounded-lg transform hover:scale-105 transition-transform duration-300"
            >
              <img className='object-cover size-full rounded-lg' src="/images/products/tire.jpg" alt="" />
              <div className='absolute text-[#e6ebf7] bottom-0 bg-[#47505f] w-full px-4 py-2 rounded-b-lg'>
                <h3 className="font-semibold text-sm">Item {index + 1}</h3>
                <p className="text-sm">Description</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FloatingComponent;
