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
        updated_at,
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


// const approveProduct = async (req, res) => {
//   const { quantities, po_id, rf_id, user_id } = req.body; // quantities is an object with product_id as keys

//   try {
//     // Start a transaction
//     await client.query('BEGIN');

//     // Insert into the dr_approved_product table
//     const insertDrApprovedProductQuery = `
//       INSERT INTO dr_approved_product (created_at)
//       VALUES (CURRENT_TIMESTAMP)
//       RETURNING dr_ap_id
//     `;
//     const drApprovedProductResult = await client.query(insertDrApprovedProductQuery);
//     const dr_ap_id = drApprovedProductResult.rows[0].dr_ap_id;

//     // Update the delivery_receipt table
//     const updateDeliveryReceiptQuery = `
//       WITH updated_row AS (
//         UPDATE delivery_receipt
//         SET status = 'checked', updated_at = CURRENT_TIMESTAMP
//         WHERE po_id = $1
//         RETURNING dr_id, date
//       )
//       SELECT dr_id 
//       FROM updated_row
//       ORDER BY date DESC
//       LIMIT 1
//     `;
//     const deliveryReceiptResult = await client.query(updateDeliveryReceiptQuery, [po_id]);
//     const dr_id = deliveryReceiptResult.rows[0].dr_id;

//     let isAnyProductApproved = false;
//     let isAnyProductPartial = false;
//     // Process each product in quantities
//     for (const [product_id, quantity] of Object.entries(quantities)) {
//       // Insert into the approved_products table
//       const insertApprovedProductQuery = `
//         INSERT INTO approved_products (product_id, dr_ap_id, quantity, dr_id)
//         VALUES ($1, $2, $3, $4)
//       `;
//       await client.query(insertApprovedProductQuery, [product_id, dr_ap_id, quantity, dr_id]);

//       // Query to get total approved quantity for the product_id in the given po_id
//       const totalApprovedQuantityQuery = `
//         SELECT SUM(ap.quantity) AS total_approved_quantity
//         FROM approved_products ap
//         JOIN delivery_receipt dr ON ap.dr_id = dr.dr_id
//         WHERE ap.product_id = $1 AND dr.po_id = $2
//       `;
//       const totalApprovedQuantityResult = await client.query(totalApprovedQuantityQuery, [product_id, po_id]);
//       const totalApprovedQuantity = totalApprovedQuantityResult.rows[0].total_approved_quantity || 0;

//       // Update request_details status based on total approved quantity
//       const getRequestDetailsQuery = `
//         SELECT rd.rd_id, rd.quantity AS requested_quantity, 
//                COALESCE(ap.quantity, 0) AS approved_quantity
//         FROM request_details rd
//         LEFT JOIN approved_products ap 
//           ON rd.product_id = ap.product_id 
//           AND ap.dr_id = $1  
//         WHERE rd.rf_id = $2 
//           AND rd.product_id = $3
//       `;
//       const requestDetailsResult = await client.query(getRequestDetailsQuery, [dr_id, rf_id, product_id]);

//       const { rd_id, requested_quantity } = requestDetailsResult.rows[0];

//       let newStatus = "partial";
//       // Use the total approved quantity here for comparison
//       if (totalApprovedQuantity >= requested_quantity) {
//         newStatus = "complete";
//         isAnyProductApproved = true;
//       } else if (totalApprovedQuantity === 0) {
//         newStatus = "redeliver";
//       } else {
//         isAnyProductPartial = true;
//       }

//       const updateRequestDetailsQuery = `
//         UPDATE request_details
//         SET status = $1
//         WHERE rd_id = $2
//       `;
//       await client.query(updateRequestDetailsQuery, [newStatus, rd_id]);
//       console.log(`Product ID: ${product_id}, Requested Quantity: ${requested_quantity}, Total Approved: ${totalApprovedQuantity}`);
//     }

//     // Update the status of the request form based on the products approved
//     let requestFormStatus = "redeliver"; // Default status if no product is approved
//     if (isAnyProductApproved) {
//       requestFormStatus = "partially received"; // Update to "to be received" if at least one product is approved
//     } else if (!isAnyProductPartial) {
//       requestFormStatus = "completed";
//     }

//     const updateRequestFormQuery = `
//       UPDATE request_form
//       SET status = $1, updated_by = $2, updated_at = CURRENT_TIMESTAMP
//       WHERE rf_id = $3
//     `;
//     await client.query(updateRequestFormQuery, [requestFormStatus, user_id, rf_id]);

//     // Commit the transaction
//     await client.query('COMMIT');

//     res.status(200).json({
//       message: 'Products approved and statuses updated successfully',
//       dr_ap_id, // Return the dr_ap_id for reference
//     });
//   } catch (error) {
//     // Rollback the transaction on error
//     await client.query('ROLLBACK');
//     console.error('Error processing product approval:', error);
//     res.status(500).json({ message: 'Error processing product approval' });
//   }
// };



const approveProduct = async (req, res) => {
  const { quantities, po_id, rf_id, user_id } = req.body;

  try {
    // Start a transaction
    await client.query("BEGIN");

    // Insert into the dr_approved_product table
    const insertDrApprovedProductQuery = `
      INSERT INTO dr_approved_product (created_at)
      VALUES (CURRENT_TIMESTAMP)
      RETURNING dr_ap_id
    `;
    const drApprovedProductResult = await client.query(insertDrApprovedProductQuery);
    const dr_ap_id = drApprovedProductResult.rows[0].dr_ap_id;

    // Update the delivery_receipt table
    const updateDeliveryReceiptQuery = `
      WITH updated_row AS (
        UPDATE delivery_receipt
        SET status = 'checked', updated_at = CURRENT_TIMESTAMP
        WHERE po_id = $1
        RETURNING dr_id, date
      )
      SELECT dr_id 
      FROM updated_row
      ORDER BY date DESC
      LIMIT 1
    `;
    const deliveryReceiptResult = await client.query(updateDeliveryReceiptQuery, [po_id]);
    const dr_id = deliveryReceiptResult.rows[0].dr_id;

    let isAnyProductApproved = false;
    let isAnyProductPartial = false;
    let totalApprovedQuantity = 0;

    for (const [product_id, quantity] of Object.entries(quantities)) {
      const insertApprovedProductQuery = `
        INSERT INTO approved_products (product_id, dr_ap_id, quantity, dr_id)
        VALUES ($1, $2, $3, $4)
      `;
      await client.query(insertApprovedProductQuery, [product_id, dr_ap_id, quantity, dr_id]);

      const totalApprovedQuantityQuery = `
        SELECT SUM(ap.quantity) AS total_approved_quantity
        FROM approved_products ap
        JOIN delivery_receipt dr ON ap.dr_id = dr.dr_id
        WHERE ap.product_id = $1 AND dr.po_id = $2
      `;
      const totalApprovedQuantityResult = await client.query(totalApprovedQuantityQuery, [product_id, po_id]);
      const productApprovedQuantity = totalApprovedQuantityResult.rows[0].total_approved_quantity || 0;

      totalApprovedQuantity += productApprovedQuantity;

      const getRequestDetailsQuery = `
        SELECT rd.rd_id, rd.quantity AS requested_quantity
        FROM request_details rd
        WHERE rd.rf_id = $1 AND rd.product_id = $2
      `;
      const requestDetailsResult = await client.query(getRequestDetailsQuery, [rf_id, product_id]);
      const { rd_id, requested_quantity } = requestDetailsResult.rows[0];

      let newStatus = "partial";
      if (totalApprovedQuantity >= requested_quantity) {
        newStatus = "complete";
        isAnyProductApproved = true;
      } else if (totalApprovedQuantity === 0) {
        newStatus = "redeliver";
      } else {
        isAnyProductPartial = true;
      }

      const updateRequestDetailsQuery = `
        UPDATE request_details
        SET status = $1
        WHERE rd_id = $2
      `;
      await client.query(updateRequestDetailsQuery, [newStatus, rd_id]);

      const { rows: warehouseInventory } = await client.query(
        `
      SELECT quantity
      FROM inventory
      WHERE product_id = $1 AND location = 'warehouse'
      `,
        [product_id]
      );

      let warehouseQuantity = parseInt(warehouseInventory[0]?.quantity, 10) || 0;
      const approvedQuantity = parseInt(quantity, 10);
      const updatedWarehouseQuantity = warehouseQuantity + approvedQuantity;

      await client.query(
            `
      UPDATE inventory
      SET quantity = $1
      WHERE product_id = $2 AND location = 'warehouse'
      `,
        [updatedWarehouseQuantity, product_id]
      );
      // Check and update "available/unavailable" statuses
      const reevaluateRequestDetailsQuery = `
        SELECT rd_id, quantity, status
        FROM request_details
        WHERE product_id = $1 AND (status = 'available' OR status = 'unavailable')
      `;
      const { rows: detailsToUpdate } = await client.query(reevaluateRequestDetailsQuery, [product_id]);

      for (const detail of detailsToUpdate) {
        const { rd_id, quantity: requestedQuantity, status: currentStatus } = detail;

        // Determine new status based on updated warehouse inventory
        let newStatus = currentStatus;
        if (updatedWarehouseQuantity >= requestedQuantity) {
          newStatus = "available";
        } else {
          newStatus = "unavailable";
        }

        // Update the status if it has changed
        if (newStatus !== currentStatus) {
          await client.query(
            `
            UPDATE request_details
            SET status = $1
            WHERE rd_id = $2
            `,
            [newStatus, rd_id]
          );
        }
      }
    }

    const checkExistingMemoQuery = `
      SELECT rm_id, total 
      FROM receiving_memo 
      WHERE po_id = $1
    `;
    const existingMemoResult = await client.query(checkExistingMemoQuery, [po_id]);

    let responseMessage = "";
    let newMemoStatus = "partially received"
    if (existingMemoResult.rows.length > 0) {
      const existingTotal = existingMemoResult.rows[0].total;
      const updatedTotal = existingTotal + totalApprovedQuantity;
      if (!isAnyProductPartial) {
        newMemoStatus = "completed"
      }

      const updateReceivingMemoQuery = `
        UPDATE receiving_memo 
        SET total = $1, status = $4, dr_ap_id = $2, memo_date = CURRENT_TIMESTAMP
        WHERE po_id = $3
      `;
      await client.query(updateReceivingMemoQuery, [updatedTotal, dr_ap_id, po_id, newMemoStatus]);
      responseMessage = "Receiving memo updated successfully";
    } else {
      const createReceivingMemoQuery = `
        INSERT INTO receiving_memo (total, status, dr_ap_id, memo_date, po_id)
        VALUES ($1, $4, $2, CURRENT_TIMESTAMP, $3)
        RETURNING rm_id
      `;
      const receivingMemoResult = await client.query(createReceivingMemoQuery, [totalApprovedQuantity, dr_ap_id, po_id, newMemoStatus]);
      responseMessage = "Receiving memo created successfully";
    }

    let requestFormStatus = "redeliver";
    if (isAnyProductApproved) {
      requestFormStatus = "partially received";
    }
    if (!isAnyProductPartial) {
      requestFormStatus = "completed";
    }

    const updateRequestFormQuery = `
      UPDATE request_form
      SET status = $1, updated_by = $2, updated_at = CURRENT_TIMESTAMP
      WHERE rf_id = $3
    `;
    await client.query(updateRequestFormQuery, [requestFormStatus, user_id, rf_id]);

    await client.query("COMMIT");

    res.status(200).json({
      message: responseMessage,
      dr_ap_id,
      total: totalApprovedQuantity,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error processing product approval:", error);
    res.status(500).json({ message: "Error processing product approval" });
  }
};

const getReceivingMemo = async (req, res) => {
  const { po_id } = req.query;

  if (!po_id) {
    return res.status(400).json({ message: "po_id is required" });
  }

  try {
    // Query to fetch the receiving_memo details based on the po_id
    const query = `
      SELECT rm.rm_id, rm.total, rm.status, rm.dr_ap_id, rm.memo_date 
      FROM receiving_memo rm
      WHERE rm.po_id = $1
    `;

    const { rows } = await client.query(query, [po_id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "No receiving memo found for the given po_id" });
    }

    // Return the receiving memo data
    res.status(200).json({
      message: "Receiving memo fetched successfully",
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching receiving memo:", error);
    res.status(500).json({ message: "Error fetching receiving memo" });
  }
};





const getApprovedProducts = async (req, res) => {
  const { dr_id } = req.params; // Access dr_id from the URL parameter

  // Validate if dr_id is provided
  if (!dr_id) {
    return res.status(400).json({ message: "dr_id is required" });
  }

  try {
    // Query to fetch approved products matching the provided dr_id
    const query = `
      SELECT ap.ap_id, ap.quantity, ap.product_id, ap.dr_id, ap.dr_ap_id, p.name AS product_name, p.size, p.unit_price
      FROM approved_products ap
      JOIN product p ON ap.product_id = p.prod_id
      WHERE ap.dr_id = $1;
    `;

    // Execute the query
    const result = await client.query(query, [dr_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'No approved products found for this delivery receipt.',
      });
    }

    res.status(200).json({
      message: 'Approved products fetched successfully',
      approved_products: result.rows,
    });
  } catch (error) {
    console.error('Error fetching approved products:', error);
    res.status(500).json({ message: 'Error fetching approved products' });
  }
};


const getRecentCheckedDeliveryReceiptByPO = async (req, res) => {
  const { po_id, dr_id } = req.params; // Access po_id and dr_id from the URL parameters

  // Validate if po_id and dr_id are provided
  if (!po_id || !dr_id) {
    return res.status(400).json({ message: "Both po_id and dr_id are required" });
  }

  try {
    // Query to get all "checked" delivery receipts for the given po_id before the specified dr_id
    const drQuery = `
      SELECT dr_id
      FROM delivery_receipt
      WHERE status = 'checked' AND po_id = $1 
      AND date < (SELECT date FROM delivery_receipt WHERE dr_id = $2)
    `;

    const drResult = await client.query(drQuery, [po_id, dr_id]);

    // If no "checked" delivery receipts are found before the specified dr_id
    if (drResult.rows.length === 0) {
      return res.status(200).json({
        message: `No previous checked delivery receipts found for po_id ${po_id} before dr_id ${dr_id}.`,
        approved_products: [],
      });
    }

    const drIds = drResult.rows.map((row) => row.dr_id); // Get all dr_id values

    // Query to get total quantities for each product across all the previous checked delivery receipts
    const totalQuantitiesQuery = `
      SELECT ap.product_id, p.name AS product_name, SUM(ap.quantity) AS quantity
      FROM approved_products ap
      JOIN product p ON ap.product_id = p.prod_id
      WHERE ap.dr_id = ANY($1::int[])
      GROUP BY ap.product_id, p.name
      ORDER BY p.name;
    `;

    const totalQuantitiesResult = await client.query(totalQuantitiesQuery, [drIds]);

    // Response
    res.status(200).json({
      message: 'Previous checked delivery receipts and total quantities fetched successfully',
      approved_products: totalQuantitiesResult.rows, // Includes product_id, product_name, and total_quantity
    });
  } catch (error) {
    console.error('Error fetching previous checked delivery receipts and total quantities by po_id:', error);
    res.status(500).json({
      message: 'Error fetching previous checked delivery receipts and total quantities by po_id',
    });
  }
};

const getAllCheckedDeliveryReceiptsByPO = async (req, res) => {
  const { po_id } = req.params; // Access po_id from the URL parameter

  // Validate if po_id is provided
  if (!po_id) {
    return res.status(400).json({ message: "po_id is required" });
  }

  try {
    // Query to get all "checked" delivery receipts for the given po_id
    const drQuery = `
      SELECT dr_id
      FROM delivery_receipt
      WHERE status = 'checked' AND po_id = $1
    `;

    const drResult = await client.query(drQuery, [po_id]);

    // If no "checked" delivery receipts are found
    if (drResult.rows.length === 0) {
      return res.status(200).json({
        message: `No checked delivery receipts found for po_id ${po_id}.`,
        approved_products: [],
      });
    }

    const drIds = drResult.rows.map((row) => row.dr_id); // Get all dr_id values

    // Query to get total quantities for each product across all the checked delivery receipts
    const totalQuantitiesQuery = `
      SELECT ap.product_id, p.name AS product_name, SUM(ap.quantity) AS quantity
      FROM approved_products ap
      JOIN product p ON ap.product_id = p.prod_id
      WHERE ap.dr_id = ANY($1::int[])
      GROUP BY ap.product_id, p.name
      ORDER BY p.name;
    `;

    const totalQuantitiesResult = await client.query(totalQuantitiesQuery, [drIds]);

    // Response
    res.status(200).json({
      message: 'All checked delivery receipts and total quantities fetched successfully',
      approved_products: totalQuantitiesResult.rows, // Includes product_id, product_name, and total_quantity
    });
  } catch (error) {
    console.error('Error fetching all checked delivery receipts and total quantities by po_id:', error);
    res.status(500).json({
      message: 'Error fetching all checked delivery receipts and total quantities by po_id',
    });
  }
};



module.exports = {
  getReceivingMemo,
  getAllCheckedDeliveryReceiptsByPO,
  getRecentCheckedDeliveryReceiptByPO,
  getPurchaseRequest,
  getApprovedProducts,
  createPurchaseRequest,
  receivePurchase,
  getDeliveryReceipts,
  approveProduct
};
