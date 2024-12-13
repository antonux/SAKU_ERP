const client = require('../connection');

// get type
const getSupplier = async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM SUPPLIER;');
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data");
  }
}

// Create supplier
const createSupplier = async (req, res) => {
  const { company_name, address, contact_name, phone, email, product_types } = req.body;
  const image = req.file ? req.file.path : null; // Assuming the image is uploaded via form-data
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

    // Insert into the product_supplier_type table (many-to-many relationship with supplier_type)
    const supplierId = result.rows[0].supplier_id; // Retrieve the inserted supplier_id
    let prodTypeValue = '';
    product_types.forEach((typeId, index) => {
      prodTypeValue += `($1, $${index + 2}), `;
    });

    // Remove the last comma and space
    prodTypeValue = prodTypeValue.slice(0, -2);

    // Create the final query
    const type_query = `
      INSERT INTO supplier_type (supplier_id, prod_type_id)
      VALUES ${prodTypeValue}
    `;

    // Prepare the array of values to pass to the query
    const type_values = [supplierId, ...product_types];
    await client.query(type_query, type_values);

    await client.query('COMMIT'); // Commit the transaction

    res.status(201).json({
      message: 'Supplier created successfully',
      supplier: { supplier_id: supplierId, company_name, address, contact_name, phone, email, image },
    });

  } catch (error) {
    await client.query('ROLLBACK'); 
    console.error("Error creating supplier:", error);
    res.status(500).send("Error creating supplier");
  }
};



module.exports = {
  getSupplier,
  createSupplier
}