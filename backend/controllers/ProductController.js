const client = require('../connection');

// get type
const getProductType = async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM PRODUCT_TYPE;');
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data");
  }
}

// create product
const createProduct = async (req, res) => {
  const { name, type, stock_status, size, unit_price, reorder_level } = req.body;
  const location_quantity = req.body.location_quantity || []; // Defaults to an empty array
  const product_supplier = req.body.product_supplier ? JSON.parse(req.body.product_supplier) : [];
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    await client.query('BEGIN'); // Start a transaction

    // Insert product into the product table
    const productQuery = `
      INSERT INTO product (name, type, image, size, unit_price, reorder_level) 
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING prod_id;
    `;
    const productValues = [name, type, image, size, unit_price, reorder_level];
    const productResult = await client.query(productQuery, productValues);
    const productId = productResult.rows[0].prod_id;

    // Insert inventory data dynamically based on the number of locations
    if (location_quantity.length > 0) {
      let inventoryQuery = `
        INSERT INTO inventory (location, quantity, product_id)
        VALUES 
      `;
      const inventoryValues = [];
      location_quantity.forEach((entry, index) => {
        inventoryQuery += `($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3}), `;
        inventoryValues.push(entry.location, entry.quantity, productId);
      });

      // Remove the last comma and space
      inventoryQuery = inventoryQuery.slice(0, -2);

      await client.query(inventoryQuery, inventoryValues);
    }

    // Insert into product_supplier table
    if (product_supplier.length > 0) {
      let supplierQuery = `
        INSERT INTO product_supplier (supplier_id, product_id)
        VALUES 
      `;
      const supplierValues = [];
      product_supplier.forEach((entry, index) => {
        supplierQuery += `($${index * 2 + 1}, $${index * 2 + 2}), `;
        supplierValues.push(entry.supplier_id, productId);
      });

      // Remove the last comma and space
      supplierQuery = supplierQuery.slice(0, -2);

      await client.query(supplierQuery, supplierValues);
    }

    // Commit transaction
    await client.query('COMMIT');

    res.status(201).json({
      message: 'Product created successfully',
      product: productResult.rows[0],
    });
  } catch (error) {
    await client.query('ROLLBACK'); // Rollback transaction on error
    console.error("Error creating product:", error);
    res.status(500).send("Error creating product");
  }
};


module.exports = {
  getProductType,
  createProduct
}