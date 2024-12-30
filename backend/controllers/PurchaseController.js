const client = require('../connection');

const getPurchaseRequest = async (req, res) => {
  try {
    // Query data from all required tables
    const purchaseFormQuery = `SELECT * FROM purchase_order;`;
    const requestFormQuery = `SELECT * FROM request_form;`;
    const requestDetailsQuery = `SELECT * FROM request_details;`;
    const productQuery = `SELECT * FROM product;`;
    const usersQuery = `SELECT user_id, username, email, fname, lname, phone, gender, role FROM users;`;
    const supplierQuery = `SELECT * FROM supplier;`;

    // Execute all queries concurrently
    const [purchaseFormResult, requestFormResult, requestDetailsResult, productResult, usersResult, supplierResult] = await Promise.all([
      client.query(purchaseFormQuery),
      client.query(requestFormQuery),
      client.query(requestDetailsQuery),
      client.query(productQuery),
      client.query(usersQuery),
      client.query(supplierQuery),
    ]);

    // Return results as arrays
    res.json({
      purchase_order: purchaseFormResult.rows,
      request_form: requestFormResult.rows,
      request_details: requestDetailsResult.rows,
      product: productResult.rows,
      users: usersResult.rows,
      suppliers: supplierResult.rows,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data");
  }
};

const createPurchaseRequest = async (req, res) => {
  const { requestedBy, totalAmount, products, productData, supplier } = req.body;

  try {
    await client.query('BEGIN'); // Start a transaction

    const requestFormQuery = `
            INSERT INTO request_form (status, total_amount, type, requested_by)
            VALUES ($1, $2, $3, $4)
            RETURNING rf_id;
        `;
    const requestFormValues = ["pending", totalAmount, "purchase", requestedBy];
    const requestFormResult = await client.query(requestFormQuery, requestFormValues);
    const rf_id = requestFormResult.rows[0].rf_id;

    // Insert into purchase_order table
    const purchaseOrderQuery = `
            INSERT INTO purchase_order (status, supplier, rf_id)
            VALUES ($1, $2, $3)
            RETURNING po_id;
        `;
    const purchaseOrderValues = ["pending", supplier, rf_id];
    const purchaseOrderResult = await client.query(purchaseOrderQuery, purchaseOrderValues);
    const po_id = purchaseOrderResult.rows[0].po_id;

    // Prepare request_details inserts
    if (products && products.length > 0) {
      let requestDetailsQuery = `
                INSERT INTO request_details (quantity, status, product_id, rf_id)
                VALUES 
            `;
      const requestDetailsValues = [];
      let insertedCount = 0;

      for (const product of products) {
        const warehouseProduct = productData.find(
          (p) => p.prod_id === product.id && p.location_quantity.some(l => l.location === "warehouse")
        );

        if (!warehouseProduct) {
          throw new Error(`Product with ID ${product.id} not found in the warehouse or missing location data.`);
        }

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

        requestDetailsQuery += `($${insertedCount * 4 + 1}, $${insertedCount * 4 + 2}, $${insertedCount * 4 + 3}, $${insertedCount * 4 + 4}), `;
        requestDetailsValues.push(product.quantity, productStatus, product.id, rf_id);
        insertedCount++;
      }

      if (insertedCount === 0) {
        throw new Error("No valid request details to insert.");
      }

      requestDetailsQuery = requestDetailsQuery.slice(0, -2);

      await client.query(requestDetailsQuery, requestDetailsValues);
    } else {
      throw new Error("No products provided for restocking.");
    }

    // Commit transaction if everything is successful
    await client.query('COMMIT');

    // Respond with the created request details and purchase order
    res.status(201).json({
      message: "Purchase request and order created successfully",
      request: { rf_id, status: "pending", totalAmount, type: "purchase", requestedBy },
      supplier: { supplier: supplier },
      purchaseOrder: { po_id, status: "pending" },
    });
  } catch (error) {
    // Rollback transaction on error
    await client.query('ROLLBACK');
    console.error("Error creating purchase request and order:", error);
    res.status(500).send("Error creating purchase request and order");
  }
};

const receivePurchase = async (req, res) => {
  const { rf_id, user_id, status, po_id } = req.body; // Include `po_id` from request data

  try {
    // Start a transaction
    await client.query('BEGIN');

    // Update the request_form table
    const updateRequestQuery = `
      UPDATE request_form
      SET status = $1, updated_by = $2, updated_at = CURRENT_TIMESTAMP
      WHERE rf_id = $3
    `;
    const updateRequestValues = [status, user_id, rf_id];
    await client.query(updateRequestQuery, updateRequestValues);

    // Insert into the delivery_receipt table
    const insertDeliveryReceiptQuery = `
      INSERT INTO delivery_receipt (status, date, po_id, received_by)
      VALUES ($1, CURRENT_TIMESTAMP, $2, $3)
      RETURNING dr_id
    `;
    const insertDeliveryReceiptValues = ['unchecked', po_id, user_id];
    const deliveryReceiptResult = await client.query(insertDeliveryReceiptQuery, insertDeliveryReceiptValues);

    // Commit the transaction
    await client.query('COMMIT');

    res.status(200).json({
      message: 'Request updated and delivery receipt created successfully',
      deliveryReceiptId: deliveryReceiptResult.rows[0].dr_id,
    });
  } catch (error) {
    // Rollback the transaction on error
    await client.query('ROLLBACK');
    console.error('Error processing request:', error);
    res.status(500).json({ message: 'Error processing request' });
  }
};

const getDeliveryReceipts = async (req, res) => {
  try {
    const query = `
      SELECT 
        dr_id AS id,
        status,
        date,
        po_id,
        received_by
      FROM delivery_receipt
      ORDER BY date DESC
    `;

    const result = await client.query(query);

    res.status(200).json({
      message: 'Delivery receipts fetched successfully',
      receipts: result.rows,
    });
  } catch (error) {
    console.error('Error fetching delivery receipts:', error);
    res.status(500).json({ message: 'Error fetching delivery receipts' });
  }
};


module.exports = {
  getPurchaseRequest,
  createPurchaseRequest,
  receivePurchase,
  getDeliveryReceipts
};
