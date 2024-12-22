
import Boxes from "../../components/Shared/inventoryBoxes";
import GoBackButton from "../../components/buttons/Backbutton";
import Input from "../../components/Shared/inventoryViewStockInput";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { IoCamera } from "react-icons/io5";
import axios from "axios";

const AddStock = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isUpdate, setIsUpdate] = useState(false)
  const [isView, setIsView] = useState(true)
  const [inventoryFilter, setInventoryFilter] = useState("");
  const [preview, setPreview] = useState("/images/products/tire.jpg");
  const { item, location: inventoryPassedFilter } = location.state;
  const [initialData, setInitialData] = useState(item);
  const [productData, setProductData] = useState({});

  useEffect(() => {
    if (location.pathname !== "/inventory") {
      localStorage.setItem("lastInventoryPath", location.pathname);
    }
    if (item.image !== null) {
      setPreview(`http://localhost:4000${item.image}`)
    } else {
      setPreview(`/images/products/user.jpg`)
    }
    if (inventoryPassedFilter !== "all") {
      setInventoryFilter(inventoryPassedFilter.location);
    }
  }, []);

  const handleGoBack = () => {
    localStorage.setItem("lastInventoryPath", "/inventory");
    const lp = localStorage.getItem("lastInventoryPath")
    navigate(lp)
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setProductData({
        ...productData,
        image: file
      });
    };
  };



  const inventoryFilterClass = (value) =>
    `px-4 font-normal rounded-full text-[#272525] ${inventoryFilter === value
      ? "border-[1px] border-black"
      : "border-[1px] border-transparent"
    } hover:border-gray-400 transition duration-200 ease-in-out`;


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('update data: ', productData)

    try {
      const formData = new FormData();

      formData.append('prod_id', productData.prod_id);
      formData.append('name', productData.name);
      formData.append('type', productData.type);
      formData.append('size', productData.size);
      formData.append('unit_price', productData.unit_price);
      formData.append('reorder_level', productData.reorder_level);
      formData.append('product_supplier', JSON.stringify(productData.product_supplier));
      formData.append('location_quantity', JSON.stringify(productData.location_quantity));

      if (productData.image) {
        formData.append('image', productData.image);
      }

      const response = await axios.post('http://localhost:4000/api/product/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const fetchNewData = await axios.get(`http://localhost:4000/api/product`);
      const newData = fetchNewData.data.find(product => product.prod_id === productData.prod_id);
      console.log('Product updated:', response.data);
      setInitialData(newData)
      setIsUpdate(false);
      setIsView(true);

    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const deleteProduct = async (prod_id) => {
    try {
      const response = await axios.delete(`http://localhost:4000/api/product/delete/${prod_id}`);
      console.log('Product deleted:', response.data);
      navigate("/inventory")
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleDeleteClick = (prod_id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(prod_id);
    }
  };

  return (
    <div className='flex flex-col gap-4 h-screen pb-5 pt-7'>
      <button onClick={handleGoBack} className="absolute z-50 translate-y-[3.2rem]">
        <GoBackButton />
      </button>
      <div className="flex flex-col pt-5 px-7 gap-10 mt-[6rem] w-full h-full shadow-md overflow-auto rounded-lg bg-white text-black scrollbar-thin">
        <div className="flex">
          <h1 className="flex whitespace-nowrap text-xl font-semibold text-[#272525]">Goodyear 155R12 <span className="text-gray-400 font-normal pl-2">#100083</span></h1>
          <div className="flex justify-end w-[75rem] text-sm gap-2 text-center items-center pr-12 cursor-pointer">
            <h1 className="font-normal text-[#272525] cursor-default">
              Location:
            </h1>
            <h1 className={inventoryFilterClass("store")}
              onClick={() => setInventoryFilter("store")}>
              Store
            </h1>
            <h1 className={inventoryFilterClass("warehouse")}
              onClick={() => setInventoryFilter("warehouse")}>
              Warehouse
            </h1>
          </div>
        </div>
        <form className="flex gap-5" onSubmit={handleSubmit}>
          <div className="relative flex flex-col gap-5">
            {/* upload picture */}
            <div className="flex flex-col gap-12 items-center border-[2px] w-[19rem] border-[#f9f9f9] pt-10 pb-5 px-20">
              <div className={`flex flex-col relative items-center justify-center  bg-[#f2f2f2] rounded-lg size-44`}>
                <div className="flex flex-col">
                  {/* Label wraps the input for accessibility and interaction */}
                  <div>
                    <img
                      src={preview}
                      alt="Preview"
                      className="order-1 object-cover rounded-lg border border-gray-200 size-44"
                    />
                  </div>
                  <label className="cursor-pointer order-2 z-50">
                    <h1
                      className={`text-sm text-[#515150] hover:text-[#999999] text-center ${isUpdate ? "absolute pl-11 pt-2" : "hidden"
                        }`}
                    >
                      {isUpdate ? "Change Photo" : ""}
                    </h1>

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>

                </div>
              </div>
              <div className="flex flex-col gap-3 text-center text-[#272525]">
                <div className="flex flex-col gap-1">
                  <h1 className="text-sm text-[#888888]">Allowed format</h1>
                  <h1 className="text-sm">JPG, JPEG, and PNG</h1>
                </div>
                <div className="flex flex-col gap-1">
                  <h1 className="text-sm text-[#888888]">Max file size</h1>
                  <h1 className="text-sm">2mb</h1>
                </div>
              </div>
            </div>
            <button
              onClick={() => { handleDeleteClick(initialData.prod_id) }}
              type="button"
              className="text-red-500 px-16 py-2 underline bottom-9 absolute">
              Delete product
            </button>
            {/* upload picture */}
          </div>
          <Input
            isUpdate={isUpdate}
            setIsUpdate={setIsUpdate}
            isView={isView}
            setIsView={setIsView}
            viewProductData={initialData}
            Preview={setPreview}
            inventoryFilter={inventoryFilter}
            newProductData={setProductData}
          />
        </form>
      </div>
    </div>
  );
};

export default AddStock;
