import React, { useState, useEffect } from 'react';
import { IoIosArrowDown, IoIosApps } from 'react-icons/io';

const FloatingComponent = ({ onClose, productData, setSelectedProduct, selectedProduct, products, selected, setSelected }) => {
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

  const isProductAdded = (productId) => {
    return products.some((product) => product.id === productId);
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-10 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-white flex flex-col p-8 pb-4 rounded-lg shadow-lg w-[50rem] h-[35rem] relative transition-transform duration-300 transform ${isVisible ? 'scale-100' : 'scale-90'}`}>
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
            )}
          </div>
        </div>

        {/* Grid Content */}
        <div className="p-2 grid grid-cols-4 gap-4 overflow-auto h-[24rem] shrink-0 scrollbar-thin">
          {productData.map((item) => (
            <div
              key={item.prod_id}
              className={`relative bg-white cursor-pointer border-[2px] ${isProductAdded(item.prod_id)
                ? "pointer-events-none border-orange-400 opacity-85"
                : "border-[#c0d4cd]"
                } ${selected?.prod_id === item.prod_id ? "border-green-500 scale-105" : ""} w-40 h-44 rounded-lg transform hover:scale-105 transition-transform duration-300`}
              onClick={() => {
                if (!isProductAdded(item.prod_id)) {
                  setSelected(item);
                }
              }}
            >
              <img className='object-cover size-full rounded-lg' src={item.image ? `http://localhost:4000${item.image}` : ""} alt="no image" />
              <div className={`absolute text-[#e6ebf7] bottom-0 bg-[#47505f] w-full px-4 py-2 rounded-b-md ${isProductAdded(item.prod_id) ? "" : ""}`}>
                <h3 className="font-semibold text-sm">{item.name}</h3>
                <p className="text-sm">{item.size}</p>
              </div>

              {/* Display "Selected" label if product is already in products */}
              {selected?.prod_id === item.prod_id && (
                <div className="absolute top-0 right-0 bg-green-500 text-white px-2 py-1 text-xs rounded-bl-lg transition-all">
                  Selected
                </div>
              )}
              {isProductAdded(item.prod_id) && (
                <div className="absolute top-0 right-0 bg-orange-400 text-white px-2 py-1 text-xs rounded-bl-lg">
                  Added
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-5 justify-center items-center h-full">
          <button
            type='button'
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-md transition-all text-sm"
            onClick={() => {
              handleClose();
              setSelected(null);
              setSelectedProduct(null);
            }}
          >
            Cancel
          </button>
          <button
            type='button'
            className="bg-green-400 hover:bg-green-500 disabled:bg-gray-400 text-white poit px-5 py-2 rounded-md transition-all text-sm"
            disabled={!selected} 
            onClick={() => {
              handleClose();
              setSelectedProduct(selected)
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default FloatingComponent;
