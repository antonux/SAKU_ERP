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


const getProduct = async (req, res) => {
  try {
    // Query to fetch product details along with inventory and product_supplier using LEFT JOIN
    const query = `
      SELECT 
        p.prod_id, 
        p.name, 
        p.type, 
        p.image, 
        p.size, 
        p.unit_price, 
        p.reorder_level,
        i.location AS inventory_location,
        i.quantity AS inventory_quantity,
        ps.supplier_id
      FROM product p
      LEFT JOIN inventory i ON p.prod_id = i.product_id
      LEFT JOIN product_supplier ps ON p.prod_id = ps.product_id;
    `;

    const result = await client.query(query);

    // Combine the data into the desired structure
    const productMap = {};

    result.rows.forEach(row => {
      // If the product doesn't exist in the map yet, initialize it
      if (!productMap[row.prod_id]) {
        productMap[row.prod_id] = {
          prod_id: row.prod_id,
          name: row.name,
          type: row.type,
          image: row.image || '', // Default empty string if null
          size: row.size,
          unit_price: row.unit_price.toString(),
          reorder_level: row.reorder_level.toString(),
          location_quantity: [
            { location: 'store', quantity: '' },
            { location: 'warehouse', quantity: '' }
          ],  // Initialize location_quantity with default store and warehouse
          product_supplier: [],
        };
      }

      // Add location and quantity if they exist and ensure no duplicate location entries
      if (row.inventory_location) {
        const locationIndex = productMap[row.prod_id].location_quantity.findIndex(
          loc => loc.location === row.inventory_location
        );

        if (locationIndex === -1) {
          // If the location doesn't exist, add it
          productMap[row.prod_id].location_quantity.push({
            location: row.inventory_location,
            quantity: row.inventory_quantity ? row.inventory_quantity.toString() : '',
          });
        } else {
          // If the location already exists, update the quantity
          productMap[row.prod_id].location_quantity[locationIndex].quantity = row.inventory_quantity ? row.inventory_quantity.toString() : '';
        }
      }

      // Add supplier_id if it exists and is unique
      if (row.supplier_id) {
        if (!productMap[row.prod_id].product_supplier.some(sup => sup.supplier_id === row.supplier_id)) {
          productMap[row.prod_id].product_supplier.push({
            supplier_id: row.supplier_id,
          });
        }
      }
    });

    // Transform the productMap object into an array
    const products = Object.values(productMap);

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching product data:", error);
    res.status(500).send("Error fetching product data");
  }
};



const createProduct = async (req, res) => {
  const { name, type, size, unit_price, reorder_level } = req.body;
  
  // Parse location_quantity from the body (ensure it's an array)
  let location_quantity = req.body.location_quantity ? JSON.parse(req.body.location_quantity) : [];

  // Validate location_quantity and quantity
  location_quantity = location_quantity.map(entry => {
    // Ensure that the quantity is a valid number, default to 0 if empty
    if (entry.quantity === '') {
      entry.quantity = 0; // Default to 0 if quantity is empty
    }
    // If quantity is not a number, set it to 0 or handle accordingly
    if (isNaN(entry.quantity)) {
      entry.quantity = 0;
    }
    return entry;
  });

  const product_supplier = req.body.product_supplier ? JSON.parse(req.body.product_supplier) : [];
  const image = req.file ? `/uploads/${req.file.filename}` : null; // Use null instead of an empty string

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

const updateProduct = async (req, res) => {
  const { prod_id, name, type, size, unit_price, reorder_level } = req.body;

  // Parse location_quantity and product_supplier from the body
  let location_quantity = req.body.location_quantity ? JSON.parse(req.body.location_quantity) : [];
  let product_supplier = req.body.product_supplier ? JSON.parse(req.body.product_supplier) : [];
  
  // Handle the image file upload (if provided)
  const image = req.file ? `/uploads/${req.file.filename}` : null; // Optional new image

  // Validate location_quantity and quantity
  location_quantity = location_quantity.map(entry => {
    if (entry.quantity === '') entry.quantity = 0;
    if (isNaN(entry.quantity)) entry.quantity = 0;
    return entry;
  });

  try {
    await client.query('BEGIN'); // Start a transaction

    // Check if the product exists
    const productQuery = `SELECT * FROM product WHERE prod_id = $1`;
    const productResult = await client.query(productQuery, [prod_id]);

    if (productResult.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update product details (using COALESCE for image to retain existing if no new image is provided)
    const productUpdateQuery = `
      UPDATE product SET
        name = $1, type = $2, size = $3, unit_price = $4, reorder_level = $5,
        image = COALESCE($6, image)  -- If no image is provided, retain the existing image
      WHERE prod_id = $7
    `;
    const productUpdateValues = [
      name, type, size, unit_price, reorder_level,
      image,  // image will be null if not provided
      prod_id
    ];
    await client.query(productUpdateQuery, productUpdateValues);

    // Update inventory locations for this product
    if (location_quantity.length > 0) {
      // First, delete existing inventory records for this product
      await client.query('DELETE FROM inventory WHERE product_id = $1', [prod_id]);

      // Insert new inventory data
      let inventoryQuery = `INSERT INTO inventory (location, quantity, product_id) VALUES `;
      const inventoryValues = [];
      location_quantity.forEach((entry, index) => {
        inventoryQuery += `($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3}), `;
        inventoryValues.push(entry.location, entry.quantity, prod_id);
      });
      inventoryQuery = inventoryQuery.slice(0, -2); // Remove the last comma
      await client.query(inventoryQuery, inventoryValues);
    }

    // Update product_supplier relationships
    if (product_supplier.length > 0) {
      // First, delete existing product_supplier records
      await client.query('DELETE FROM product_supplier WHERE product_id = $1', [prod_id]);

      // Insert new supplier data
      let supplierQuery = `INSERT INTO product_supplier (supplier_id, product_id) VALUES `;
      const supplierValues = [];
      product_supplier.forEach((entry, index) => {
        supplierQuery += `($${index * 2 + 1}, $${index * 2 + 2}), `;
        supplierValues.push(entry.supplier_id, prod_id);
      });
      supplierQuery = supplierQuery.slice(0, -2); // Remove the last comma
      await client.query(supplierQuery, supplierValues);
    }

    await client.query('COMMIT'); // Commit the transaction
    res.status(200).json({
      message: 'Product updated successfully',
      product: { prod_id, name, type, size, unit_price, reorder_level, image, location_quantity, product_supplier }
    });
  } catch (error) {
    await client.query('ROLLBACK'); // Rollback transaction on error
    console.error("Error updating product:", error);
    res.status(500).send("Error updating product");
  }
};

const deleteProduct = async (req, res) => {
  const { prod_id } = req.params; 
  try {
    const query = `
      DELETE FROM product WHERE prod_id = $1
    `;
    const values = [prod_id]; 
    await client.query(query, values);

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error("Error deleting prodct:", error);
    res.status(500).send("Error deleting product");
  }
};



module.exports = {
  getProduct,
  getProductType,
  createProduct,
  deleteProduct,
  updateProduct
}