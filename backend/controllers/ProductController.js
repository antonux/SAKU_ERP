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



module.exports = {
  getProduct,
  getProductType,
  createProduct
}