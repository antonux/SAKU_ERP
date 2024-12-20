const client = require('../connection');


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

        const productStatus = warehouseQuantity >= product.quantity ? "available" : "unavailable";

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



module.exports = {
  createRestockRequest
}