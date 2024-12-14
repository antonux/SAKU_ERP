const client = require('../connection');

// get suppliers
const getSupplier = async (req, res) => {
  try {
    // Query to get supplier data along with their product types and product type IDs
    const query = `
      SELECT s.supplier_id, s.company_name, s.address, s.contact_name, s.phone, s.email, s.image, 
             pt.type AS product_type
      FROM SUPPLIER s
      LEFT JOIN SUPPLIER_TYPE st ON s.supplier_id = st.supplier_id
      LEFT JOIN PRODUCT_TYPE pt ON st.prod_type_id = pt.prod_type_id;
    `;

    // Execute the query
    const result = await client.query(query);

    // Group the data by supplier_id to consolidate product types and their IDs
    const suppliers = {};

    result.rows.forEach(row => {
      if (!suppliers[row.supplier_id]) {
        suppliers[row.supplier_id] = {
          supplier_id: row.supplier_id,
          company_name: row.company_name,
          address: row.address,
          contact_name: row.contact_name,
          phone: row.phone,
          email: row.email,
          image: row.image,
          product_types: []
        };
      }

      if (row.product_type) {
        suppliers[row.supplier_id].product_types.push(row.product_type);
      }
    });

    // Convert the suppliers object to an array
    const supplierArray = Object.values(suppliers);

    // Send the response
    res.json(supplierArray);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data");
  }
};


const deleteSupplier = async (req, res) => {
  const { supplier_id } = req.params; 
  try {
    const query = `
      DELETE FROM supplier WHERE supplier_id = $1
    `;
    const values = [supplier_id]; 
    await client.query(query, values);

    res.status(200).json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    console.error("Error deleting supplier:", error);
    res.status(500).send("Error deleting supplier");
  }
};





// Create supplier
// const createSupplier = async (req, res) => {
//   const { company_name, address, contact_name, phone, email} = req.body;
//   let product_types = req.body.product_types ? JSON.parse(req.body.product_types) : [];
//   const image = req.file ? `/uploads/${req.file.filename}` : null;
//   try {
//     await client.query('BEGIN'); // Start a transaction
//     // Insert the supplier into the supplier table
//     const query = `
//       INSERT INTO supplier (company_name, address, contact_name, phone, email, image) 
//       VALUES ($1, $2, $3, $4, $5, $6)
//       RETURNING supplier_id;
//     `;
//     const values = [company_name, address, contact_name, phone, email, image];
//     const result = await client.query(query, values);

//     // Insert into the product_supplier_type table (many-to-many relationship with supplier_type)
//     const supplierId = result.rows[0].supplier_id; // Retrieve the inserted supplier_id
//     let prodTypeValue = '';
//     product_types.forEach((typeId, index) => {
//       prodTypeValue += `($1, $${index + 2}), `;
//     });

//     // Remove the last comma and space
//     prodTypeValue = prodTypeValue.slice(0, -2);

//     // Create the final query
//     const type_query = `
//       INSERT INTO supplier_type (supplier_id, prod_type_id)
//       VALUES ${prodTypeValue}
//     `;

//     // Prepare the array of values to pass to the query
//     const type_values = [supplierId, ...product_types];
//     await client.query(type_query, type_values);

//     await client.query('COMMIT'); // Commit the transaction

//     res.status(201).json({
//       message: 'Supplier created successfully',
//       supplier: { supplier_id: supplierId, company_name, address, contact_name, phone, email, image },
//     });

//   } catch (error) {
//     await client.query('ROLLBACK'); 
//     console.error("Error creating supplier:", error);
//     res.status(500).send("Error creating supplier");
//   }
// };

const createSupplier = async (req, res) => {
  const { company_name, address, contact_name, phone, email } = req.body;
  let product_types = req.body.product_types ? JSON.parse(req.body.product_types) : [];
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    await client.query('BEGIN'); // Start a transaction

    // Insert the supplier into the supplier table
    const query = `
      INSERT INTO supplier (company_name, address, contact_name, phone, email, image) 
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING supplier_id;
    `;
    const values = [company_name, address, contact_name, phone, email, image];
    const result = await client.query(query, values);

    // Retrieve the inserted supplier_id
    const supplierId = result.rows[0].supplier_id;

    // Get the prod_type_id for each product_type
    const prodTypeIds = await Promise.all(product_types.map(async (productType) => {
      const typeQuery = 'SELECT prod_type_id FROM product_type WHERE type = $1';
      const typeResult = await client.query(typeQuery, [productType]);
      return typeResult.rows.length > 0 ? typeResult.rows[0].prod_type_id : null;
    }));

    // Filter out any null values (if product types do not exist in the product_type table)
    const validProdTypeIds = prodTypeIds.filter(id => id !== null);

    // Insert into the supplier_type table (many-to-many relationship with supplier_type)
    const prodTypeValues = validProdTypeIds.map((typeId, index) => `($1, $${index + 2})`).join(', ');

    // Create the final query
    const type_query = `
      INSERT INTO supplier_type (supplier_id, prod_type_id)
      VALUES ${prodTypeValues}
    `;

    // Prepare the array of values to pass to the query
    const type_values = [supplierId, ...validProdTypeIds];
    await client.query(type_query, type_values);

    await client.query('COMMIT'); // Commit the transaction

    res.status(201).json({
      message: 'Supplier created successfully',
      supplier: { supplier_id: supplierId, company_name, address, contact_name, phone, email, image },
    });

  } catch (error) {
    await client.query('ROLLBACK'); // Rollback in case of error
    console.error("Error creating supplier:", error);
    res.status(500).send("Error creating supplier");
  }
};


const updateSupplier = async (req, res) => {
  const { supplier_id, company_name, address, contact_name, phone, email } = req.body;
  let product_types = req.body.product_types ? JSON.parse(req.body.product_types) : [];
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    await client.query('BEGIN'); // Start a transaction

    // Update the supplier details
    const updateQuery = `
      UPDATE supplier
      SET 
        company_name = $1,
        address = $2,
        contact_name = $3,
        phone = $4,
        email = $5,
        image = COALESCE($6, image) -- If no image is provided, retain the existing image
      WHERE supplier_id = $7
    `;
    const updateValues = [company_name, address, contact_name, phone, email, image, supplier_id];
    await client.query(updateQuery, updateValues);

    // Delete existing product types for the supplier in `supplier_type`
    const deleteQuery = 'DELETE FROM supplier_type WHERE supplier_id = $1';
    await client.query(deleteQuery, [supplier_id]);

    // Get the prod_type_id for each new product type
    const prodTypeIds = await Promise.all(product_types.map(async (productType) => {
      const typeQuery = 'SELECT prod_type_id FROM product_type WHERE type = $1';
      const typeResult = await client.query(typeQuery, [productType]);
      return typeResult.rows.length > 0 ? typeResult.rows[0].prod_type_id : null;
    }));

    // Filter out any null values
    const validProdTypeIds = prodTypeIds.filter(id => id !== null);

    // Insert the new product types for the supplier
    if (validProdTypeIds.length > 0) {
      const prodTypeValues = validProdTypeIds.map((typeId, index) => `($1, $${index + 2})`).join(', ');
      const insertTypeQuery = `
        INSERT INTO supplier_type (supplier_id, prod_type_id)
        VALUES ${prodTypeValues}
      `;
      const insertTypeValues = [supplier_id, ...validProdTypeIds];
      await client.query(insertTypeQuery, insertTypeValues);
    }

    await client.query('COMMIT'); // Commit the transaction

    res.status(200).json({ message: 'Supplier updated successfully' });

  } catch (error) {
    await client.query('ROLLBACK'); // Rollback in case of error
    console.error("Error updating supplier:", error);
    res.status(500).send("Error updating supplier");
  }
};




module.exports = {
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier
}