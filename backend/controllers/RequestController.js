const client = require('../connection');


const getRestockRequest = async (req, res) => {
  try {
    // Query data from all required tables
    const requestFormQuery = `SELECT * FROM request_form;`;
    const requestDetailsQuery = `SELECT * FROM request_details;`;
    const productQuery = `SELECT * FROM product;`;
    const usersQuery = `SELECT user_id, username, email, fname, lname, phone, gender, role FROM users;`;

    // Execute all queries concurrently
    const [requestFormResult, requestDetailsResult, productResult, usersResult] = await Promise.all([
      client.query(requestFormQuery),
      client.query(requestDetailsQuery),
      client.query(productQuery),
      client.query(usersQuery),
    ]);

    // Return results as arrays
    res.json({
      request_form: requestFormResult.rows,
      request_details: requestDetailsResult.rows,
      product: productResult.rows,
      users: usersResult.rows,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data");
  }
};


const createRestockRequest = async (req, res) => {
  const { requestedBy, totalAmount, products, productData } = req.body;

  try {
    await client.query('BEGIN'); // Start a transaction

    // Insert into request_form table
    const requestFormQuery = `
      INSERT INTO request_form (status, total_amount, type, requested_by)
      VALUES ($1, $2, $3, $4)
      RETURNING rf_id;
    `;
    const requestFormValues = ["pending", totalAmount, "restock", requestedBy];
    const requestFormResult = await client.query(requestFormQuery, requestFormValues);
    const rf_id = requestFormResult.rows[0].rf_id;

    // Prepare request_details inserts
    if (products && products.length > 0) {
      let requestDetailsQuery = `
        INSERT INTO request_details (quantity, status, product_id, rf_id)
        VALUES 
      `;
      const requestDetailsValues = [];
      let insertedCount = 0; // To track if any details were inserted

      // Loop through each product and prepare insert data
      for (const product of products) {
        const warehouseProduct = productData.find(
          (p) => p.prod_id === product.id && p.location_quantity.some(l => l.location === "warehouse")
        );

        if (!warehouseProduct) {
          throw new Error(`Product with ID ${product.id} not found in the warehouse or missing location data.`);
        }

        // Find the quantity in the warehouse
        const warehouseQuantity = warehouseProduct.location_quantity.find(
          (location) => location.location === "warehouse"
        )?.quantity;

        if (warehouseQuantity === undefined) {
          throw new Error(`Warehouse quantity not found for product ID ${product.id}.`);
        }

        const requestedQuantity = Number(product.quantity);
        const availableQuantity = Number(warehouseQuantity);

        if (isNaN(requestedQuantity) || isNaN(availableQuantity)) {
          throw new Error(`Invalid quantity value for product ID ${product.id}.`);
        }

        let productStatus = availableQuantity >= requestedQuantity ? "available" : "unavailable";


        // Build the query dynamically
        requestDetailsQuery += `($${insertedCount * 4 + 1}, $${insertedCount * 4 + 2}, $${insertedCount * 4 + 3}, $${insertedCount * 4 + 4}), `;
        requestDetailsValues.push(product.quantity, productStatus, product.id, rf_id);
        insertedCount++;
      }

      // Check if any data was inserted
      if (insertedCount === 0) {
        throw new Error("No valid request details to insert.");
      }

      // Remove the last comma and space from the query
      requestDetailsQuery = requestDetailsQuery.slice(0, -2);

      // Insert into request_details
      await client.query(requestDetailsQuery, requestDetailsValues);
    } else {
      throw new Error("No products provided for restocking.");
    }

    // Commit transaction if everything is successful
    await client.query('COMMIT');

    // Respond with the created request details
    res.status(201).json({
      message: "Restock request created successfully",
      request: { rf_id, status: "pending", totalAmount, type: "restock", requestedBy },
    });
  } catch (error) {
    // Rollback transaction on error
    await client.query('ROLLBACK');
    console.error("Error creating restock request:", error);
    res.status(500).send("Error creating restock request");
  }
};


const deleteRequest = async (req, res) => {
  const { rf_id } = req.params; 
  try {
    const query = `
      DELETE FROM request_form WHERE rf_id = $1
    `;
    const values = [rf_id]; 
    await client.query(query, values);

    res.status(200).json({ message: 'Request deleted successfully' });
  } catch (error) {
    console.error("Error deleting request:", error);
    res.status(500).send("Error deleting request");
  }
};

const updateRequest = async (req, res) => {
  const { rf_id, user_id, status } = req.body; 

  try {
    const query = `
      UPDATE request_form
      SET status = $1, updated_by = $2, updated_at = CURRENT_TIMESTAMP
      WHERE rf_id = $3
    `;
    const values = [status, user_id, rf_id]; 

    await client.query(query, values);

    res.status(200).json({ message: 'Request updated successfully' });
  } catch (error) {
    console.error("Error approving request:", error);
    res.status(500).json({ message: "Error updating request" });
  }
};




module.exports = {
  createRestockRequest,
  getRestockRequest,
  updateRequest,
  deleteRequest
}