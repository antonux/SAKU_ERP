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

const ProductOrderForm = () => {
    const { user, userID } = useRole();
    const [showFloating, setShowFloating] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentProduct, setCurrentProduct] = useState(null)
    const [newQuantity, setNewQuantity] = useState("")
    const [productData, setProductData] = useState([])
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [selected, setSelected] = useState(null)
    const [selectedSupplier, setSelectedSupplier] = useState("")
    const QuantityInputRef = useRef(null)
    const [isRestockRequestModalOpen, setIsRestockRequestModalOpen] = useState(false);


    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    const handleSupplierChange = (e) => {
        const supplierID = parseInt(e.target.value, 10);
        if (isNaN(supplierID)) {
            console.error("Invalid Supplier ID");
            return;
        }
        console.log("Supplier ID Selected:", supplierID);
        setSelectedSupplier(supplierID);
    };

    useEffect(() => {
        if (location.pathname !== "/request") {
            localStorage.setItem("lastRequestPath", location.pathname)
        }
    }, [])

    const handleGoBack = () => {
        localStorage.setItem("lastRequestPath", "/request")
        setSelectedSupplier(""); // Reset the selected supplier after submission
        setProducts([]);  // Clear form data before navigating back
        setSelectedProduct(null);  // Reset selected product
        const lp = localStorage.getItem("lastRequestPath")
        navigate(lp)
    }

    const totalAmount = products.reduce((sum, product) => sum + product.total, 0)

    const handleDelete = (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this item?")
        if (confirmDelete) {
            setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id))
        }
    }

    const handleEditQuantity = (product) => {
        setCurrentProduct(product)
        setNewQuantity(product.quantity)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
    }

    const saveNewQuantity = () => {
        if (!isNaN(newQuantity) && newQuantity > 0) {
            setProducts((prevProducts) =>
                prevProducts.map((product) =>
                    product.id === currentProduct.id
                        ? {
                            ...product,
                            quantity: parseInt(newQuantity),
                            total: product.amount * parseInt(newQuantity),
                        }
                        : product
                )
            )
            setIsModalOpen(false)
            setCurrentProduct(null)
        } else {
            alert("Please enter a valid quantity.")
        }
    }

    useEffect(() => {
        const fetchSupplierData = async () => {
            try {
                const response = await axios.get("http://localhost:4000/api/supplier"); // Ensure this endpoint returns supplier data
                console.log("Supplier data:", response.data);
                setSuppliers(response.data); // Assuming response.data is an array of suppliers
            } catch (err) {
                console.error("Error fetching supplier data:", err);
            }
        };
        fetchSupplierData();
    }, []);

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/product');
                setProductData(response.data)
            } catch (err) {
                console.error('Error fetching product data:', err);
            }
        };
        fetchProductData();
    }, []);

    const getFilteredProductData = (data) => {
        return data.map((product) => ({
            ...product,
            location_quantity: product.location_quantity.filter(
                (location) => location.location === "warehouse"
            ),
        }))
    }

    const handleAdd = () => {
        if (selectedProduct && selectedSupplier) {
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
                    currentStock: selectedProduct.location_quantity?.[0]?.quantity || 0,
                },
            ])
            setSelectedProduct()
            setSelected(null)
        } else {
            alert("Please select both a supplier and a product")
        }
    }

    useEffect(() => {
        if (QuantityInputRef.current) {
            QuantityInputRef.current.focus()
        }
    }, [selectedProduct])

    const handleQuantityChange = (e) => {
        const quantity = e.target.value
        if (quantity === "") {
            setSelectedProduct((prev) => ({
                ...prev,
                quantity: "",
            }))
            return
        }
        if (quantity.includes(".") || quantity <= 0 || quantity >= 1000) {
            e.preventDefault()
            return
        }
        setSelectedProduct((prev) => ({
            ...prev,
            quantity: quantity,
        }))
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent the form submission on Enter key
        }
    };

    const handleSubmit = async (e) => {
        console.log(products);
        e.preventDefault();

        console.log("Products in request:", products); // Check products
        console.log("Selected Supplier:", selectedSupplier); // Check if supplier is set
        console.log("Product Data:", productData); // Verify product data
        console.log("Total Amount:", totalAmount); // Verify total amount
        console.log("Requested By (User ID):", userID); // Verify user ID


        try {
            const requestData = {
                requestedBy: userID,
                products: products,
                totalAmount: totalAmount,
                productData: productData,
                supplier: selectedSupplier,
            };

            console.log("Request Data Sent to Backend:", requestData); // Debug request data

            const response = await axios.post('http://localhost:4000/api/purchase/create/purchase', requestData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Purchase Request Created:', response.data);
            setIsRestockRequestModalOpen(true);

            setProducts([]);
            setSelectedProduct();
            setSelectedSupplier(""); // Reset the selected supplier after submission


        } catch (error) {
            console.error('Error creating Purchase request:', error);
            alert('Failed to create Purchase request. Please try again.');
        }
    };

    const closeRestockRequestModal = () => {
        setIsRestockRequestModalOpen(false);
    };

    return (
        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className='flex flex-col gap-4 h-screen pb-5 pt-7'>
            {isRestockRequestModalOpen &&
                <RestockRequest onClose={closeRestockRequestModal} />
            }
            <button onClick={handleGoBack} className="absolute z-50 translate-y-[3.2rem]">
                <GoBackButton />
            </button>
            <div className="flex flex-col pt-5 px-7 pb-10 gap-10 mt-[6rem] w-full h-full shadow-md overflow-auto rounded-lg bg-white text-black scrollbar-thin">
                {showFloating && (
                    <FloatingComponent
                        onClose={() => setShowFloating(false)}
                        productData={getFilteredProductData(productData)}
                        selectedProduct={selectedProduct}
                        setSelectedProduct={setSelectedProduct}
                        products={products}
                        selected={selected}
                        setSelected={setSelected}
                    />
                )}
                <h1 className="text-xl font-semibold text-[#272525]">
                    Product Order Form
                </h1>
                <div className="flex flex-col gap-5">
                    <div className="w-[20rem]">
                        <label
                            htmlFor="supplier"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Supplier
                        </label>
                        <select
                            id="supplier"
                            className="mt-1 block w-full px-3 py-4 text-center text-sm border border-gray-300 rounded-xl shadow-sm focus:outline-none"
                            onChange={handleSupplierChange}
                            value={selectedSupplier}
                            required
                        >
                            <option value="">Select a supplier</option>
                            {suppliers.map((supplier) => (
                                <option key={supplier.supplier_id} value={supplier.supplier_id}>
                                    {supplier.company_name}
                                </option>
                            ))}
                        </select>

                    </div>
                    <div className="flex gap-5 whitespace-nowrap items-center">
                        <div className="w-[20rem]">
                            <label
                                htmlFor="product"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Product
                            </label>
                            <input
                                type="text"
                                id="product"
                                onClick={() => setShowFloating(true)}
                                readOnly
                                value={
                                    selectedProduct
                                        ? `${selectedProduct.name} ${selectedProduct.size}`
                                        : ""
                                }
                                placeholder="Choose product"
                                className="mt-1 block cursor-pointer w-full px-3 py-3 transition hover:shadow-md hover:placeholder-[#383131] hover:border-gray-200 text-center text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none"
                                disabled={!selectedSupplier} // Disable product selection if no supplier is selected
                            />
                        </div>
                        <div className="w-[20rem]">
                            <label
                                htmlFor="quantity"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Quantity
                            </label>
                            <input
                                type="number"
                                min="1"
                                ref={QuantityInputRef}
                                disabled={!selectedProduct}
                                value={selectedProduct?.quantity || ""}
                                onChange={handleQuantityChange}
                                id="quantity"
                                placeholder="Enter quantity"
                                className="mt-1 block w-full px-3 py-3 text-center text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none"
                            />
                        </div>
                        <div className="w-[15rem] ml-5 mt-5">
                            <button
                                disabled={
                                    !selectedProduct ||
                                    !selectedSupplier ||
                                    selectedProduct.quantity === undefined ||
                                    selectedProduct.quantity === ""
                                }
                                onClick={() => {
                                    handleAdd()
                                }}
                                className="bg-[#7ad0ac] text-white text-sm font-normal px-8 py-[0.65rem] rounded-lg hover:bg-[#71c2a0] disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-green-50"
                            >
                                Add Product
                            </button>
                        </div>
                    </div>
                </div>
                <div className="rounded-lg w-[65rem] mb-10 shrink-0 border-[1px] border-gray-100 overflow-auto scrollbar-thin">
                    <table className="text-sm w-[64rem] text-left text-gray-500">
                        <thead className="sticky top-0 bg-white">
                            <tr className="text-xs text-gray-700 uppercase">
                                <th scope="col" className="px-6 py-3">
                                    ID
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Product
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Size/Model
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Category
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Quantity
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Amount
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Total Amount
                                </th>
                                <th scope="col" className="px-6 py-3">Current Stock</th>
                                <th scope="col" className="px-6 py-3 text-center">
                                    Actions
                                </th>
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
                                    <td className="px-6 py-5">{product.currentStock || 0}</td>
                                    <td className="px-6 py-5 flex gap-2 justify-center items-center">
                                        <button
                                            className="text-blue-600 mr-5 hover:text-blue-800"
                                            onClick={() => handleEditQuantity(product)}
                                        >
                                            Edit Quantity
                                        </button>
                                        <button
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
                                <td colSpan="6" className="px-6 py-4 font-semibold">
                                    TOTAL
                                </td>
                                <td className="px-6 py-5 font-semibold">
                                    ₱{totalAmount.toLocaleString()}
                                </td>
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
                    {user !== "warehouse" && (
                        <button className="bg-[#7fd6b2] text-white font-normal text-sm px-20 py-[.72rem] rounded-lg hover:bg-[#71c2a0] focus:outline-none focus:ring-2 focus:ring-green-50">
                            Approve
                        </button>
                    )}
                    {user === "warehouse" && (
                        <button
                            className="bg-[#7fd6b2] text-white disabled:bg-gray-400 font-normal text-sm px-20 py-[.72rem] rounded-lg hover:bg-[#71c2a0] focus:outline-none focus:ring-2 focus:ring-green-50"
                            disabled={products.length === 0}
                        >
                            Submit
                        </button>
                    )}
                </div>
            </div>
        </form>
    )
};

export default ProductOrderForm;

