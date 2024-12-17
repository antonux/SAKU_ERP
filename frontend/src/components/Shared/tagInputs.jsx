const TagInput = ({ tags, setTags, productData, setProductData, isView }) => {
  const removeTag = (tagToRemove) => {
    // Remove tag from `tags` state
    setTags(tags.filter((tag) => tag.supplier_id !== tagToRemove.supplier_id));

    // Remove supplier_id from `productData.product_supplier`
    setProductData((prevData) => ({
      ...prevData,
      product_supplier: prevData.product_supplier.filter(
        (supplier) => supplier.supplier_id !== tagToRemove.supplier_id
      ),
    }));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <div
            key={tag.supplier_id}
            className="flex mt-2 items-center px-3 bg-gray-200 rounded-full"
          >
            <span>{tag.company_name}</span>
            <button
              type="button"
              hidden={isView}
              onClick={() => removeTag(tag)}
              className={`ml-2 pb-1 text-3xl text-gray-500 hover:text-red-700`}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};


export default TagInput;
