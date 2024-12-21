import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import axios from "axios";

// Components
import GoBackButton from "../../components/buttons/Backbutton";
import FloatingComponent from "../../components/Shared/floatingInventory";

// Context
import { useRole } from "../../contexts/RoleContext";

// Modals
import EditQuantity from "../../modals/EditQuantity";
import RestockRequest from "../../modals/restockRequest";

const AddStock = () => {
  const navigate = useNavigate();
  const { user, userID } = useRole();
  const [showFloating, setShowFloating] = useState(false);
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [newQuantity, setNewQuantity] = useState("");
  const [productData, setProductData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selected, setSelected] = useState(null);
  const [invalidQuantity, setInvalidQuantity] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isRestockRequestModalOpen, setIsRestockRequestModalOpen] = useState(false)
  const QuantityInputRef = useRef(null);

  const [products, setProducts] = useState([]);


  useEffect(() => {
    if (location.pathname !== "/request") {
      localStorage.setItem("lastRequestPath", location.pathname);
    }
  }, []);

  const handleGoBack = () => {
    localStorage.setItem("lastRequestPath", "/request");
    const lp = localStorage.getItem("lastRequestPath")
    navigate(lp)
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (confirmDelete) {
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
    }
  };
  const handleEditQuantity = (product) => {
    setCurrentProduct(product);
    setNewQuantity(product.quantity);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false)
  };

  const saveNewQuantity = () => {
    if (!isNaN(newQuantity) && newQuantity > 0) {
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === currentProduct.id
            ? { ...product, quantity: parseInt(newQuantity), total: product.amount * parseInt(newQuantity) }
            : product
        )
      );
      setIsModalOpen(false);
      setCurrentProduct(null);
    } else {
      alert("Please enter a valid quantity.");
    }
  };

  useEffect(() => {
    const fetchSupplierData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/product');
        setProductData(response.data)
      } catch (err) {
        console.error('Error fetching product data:', err);
      }
    };
    fetchSupplierData();
  }, []);

  const getFilteredProductData = (data) => {
    return data.map((product) => ({
      ...product,
      location_quantity: product.location_quantity.filter(
        (location) => location.location === 'store'
      ),
    }));
  };

  const handleAdd = () => {
    if (selectedProduct) {
      setProducts((prevProducts) => [
        ...prevProducts,
        {
          id: selectedProduct.prod_id,
          product: selectedProduct.name,
          size: selectedProduct.size,
          category: selectedProduct.type,
          quantity: selectedProduct.quantity,
          amount: parseFloat(selectedProduct.unit_price),
          total: parseFloat(selectedProduct.unit_price * selectedProduct.quantity),
        },
      ]);
      setSelectedProduct();
      setSelected(null);
    }
  };

  useEffect(() => {
    QuantityInputRef.current.focus();
  }, [selectedProduct])

  const handleQuantityChange = (e) => {
    const quantity = e.target.value;
    if (quantity === '') {
      setSelectedProduct((prev) => ({
        ...prev,
        quantity: '',
      }));
      return;
    }
    if (quantity.includes('.') || quantity <= 0 || quantity >= 1000) {
      e.preventDefault();
      setInvalidQuantity(true);
      return;
    }
    setInvalidQuantity(false);
    setSelectedProduct((prev) => ({
      ...prev,
      quantity: quantity,
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent the form submission on Enter key
    }
  };

  useEffect(() => {
    if (products.length > 0) {
      const calculatedTotalAmount = products.reduce((sum, product) => sum + product.total, 0);
      setTotalAmount(calculatedTotalAmount);
    }
  }, [selectedProduct, products]);

  const handleSubmit = async (e) => {
    console.log(products);
    e.preventDefault();
    try {

      const requestData = {
        requestedBy: userID,
        products: products, 
        totalAmount: totalAmount, 
        productData: productData 
      };

      const response = await axios.post('http://localhost:4000/api/request/create/restock', requestData, {
        headers: {
          'Content-Type': 'application/json', 
        },
      });

      console.log('Restock Request Created:', response.data);
      setIsRestockRequestModalOpen(true);

      setProducts([]);
      setSelectedProduct();

    } catch (error) {
      console.error('Error creating restock request:', error);
      alert('Failed to create restock request. Please try again.');
    }
  };
  
  const closeRestockRequestModal = () => {
    setIsRestockRequestModalOpen(false);
  };

  return (
    <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className='flex flex-col gap-4 h-screen pb-5 pt-7'>
      {isRestockRequestModalOpen &&
        <RestockRequest onClose={closeRestockRequestModal}/>
      }
      <button type="button" onClick={handleGoBack} className="absolute z-50 translate-y-[3.2rem]">
        <GoBackButton />
      </button>
      <div className="flex flex-col pt-5 px-7 pb-10 gap-10 mt-[6rem] w-full h-full shadow-md overflow-auto rounded-lg bg-white text-black scrollbar-thin">
        {showFloating &&
          <FloatingComponent
            onClose={() => setShowFloating(false)}
            productData={getFilteredProductData(productData)}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            products={products}
            selected={selected}
            setSelected={setSelected}
          />
        }
        <h1 className="text-xl font-semibold text-[#272525]">Product Request Form</h1>
        <div className="flex gap-5 whitespace-nowrap items-center">
          <div className="w-[20rem]">
            <label htmlFor="product" className="block text-sm font-medium text-gray-700">Product</label>
            <input
              type="text"
              id="product"
              onClick={() => setShowFloating(true)}
              readOnly
              value={selectedProduct ? `${selectedProduct.name} ${selectedProduct.size}` : ""}
              placeholder="Choose product"
              className="mt-1 block cursor-pointer w-full px-3 py-3 transition hover:shadow-md hover:placeholder-[#383131] hover:border-gray-200 text-center text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none"
            />
          </div>
          <div className="w-[20rem]">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              min="1"
              ref={QuantityInputRef}
              disabled={!selectedProduct}
              value={selectedProduct?.quantity || ""}
              onChange={handleQuantityChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && selectedProduct.quantity > 0) {
                  handleAdd();
                }
              }}
              id="quantity"
              placeholder="Enter quantity"
              className="mt-1 block w-full px-3 py-3 text-center text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none"
            />
          </div>
          <div className="w-[15rem] ml-5 mt-5">
            <button
              disabled={!selectedProduct || selectedProduct.quantity === undefined || selectedProduct.quantity === ""}
              onClick={() => { handleAdd(); }}
              className="bg-[#7ad0ac] text-white text-sm font-normal px-8 py-[0.65rem] rounded-lg hover:bg-[#71c2a0] disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-green-50">
              Add Product
            </button>
          </div>
        </div>
        <div className="rounded-lg w-[65rem] mb-10 shrink-0 border-[1px] border-gray-100 overflow-auto scrollbar-thin">
          <table className="text-sm w-[64rem] text-left text-gray-500">
            <thead className="sticky top-0 bg-white">
              <tr className="text-xs text-gray-700 uppercase">
                <th scope="col" className="px-6 py-3">ID</th>
                <th scope="col" className="px-6 py-3">Product</th>
                <th scope="col" className="px-6 py-3">Size/Model</th>
                <th scope="col" className="px-6 py-3">Category</th>
                <th scope="col" className="px-6 py-3">Quantity</th>
                <th scope="col" className="px-6 py-3">Amount</th>
                <th scope="col" className="px-6 py-3">Total Amount</th>
                <th scope="col" className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-5">{product.id}</td>
                  <td className="px-6 py-5">{product.product}</td>
                  <td className="px-6 py-5">{product.size}</td>
                  <td className="px-6 py-5">{product.category}</td>
                  <td className="px-6 py-5">{product.quantity}</td>
                  <td className="px-6 py-5">₱{product.amount.toLocaleString()}</td>
                  <td className="px-6 py-5">₱{product.total.toLocaleString()}</td>
                  <td className="px-6 py-5 flex gap-2 justify-center items-center">
                    <button
                      type="button"
                      className="text-blue-600 mr-5 hover:text-blue-800"
                      onClick={() => handleEditQuantity(product)}
                    >
                      Edit Quantity
                    </button>
                    <button
                      type="button"
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(product.id)}
                    >
                      <FaRegTrashCan className="size-[1.1rem] hover:scale-110 transition-all" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className={`${products.length === 0 ? "hidden" : ""}`}>
              <tr className="bg-white">
                <td colSpan="6" className="px-6 py-4 font-semibold">TOTAL</td>
                <td className="px-6 py-5 font-semibold">₱{totalAmount.toLocaleString()}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>

          {isModalOpen && (
            <EditQuantity
              saveNewQuantity={saveNewQuantity}
              setNewQuantity={setNewQuantity}
              onClose={closeModal}
              newQuantity={newQuantity}
            />
          )}
        </div>
        <div>
          <button
            type="submit"
            className="bg-[#7fd6b2] text-white disabled:bg-gray-400 font-normal text-sm px-20 py-[.72rem] rounded-lg hover:bg-[#71c2a0] focus:outline-none focus:ring-2 focus:ring-green-50"
            disabled={products.length === 0}
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddStock;
