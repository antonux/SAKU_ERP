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
  const { prod_id, name, type, stock_status, size, unit_price, reorder_level } = req.body;
  const image = req.file ? req.file.path : null; 
  try {
    const query = `
      INSERT INTO product (prod_id, name, type, image, stock_status, size, unit_price, reorder_level) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
    const values = [prod_id, name, type, image, stock_status, size, unit_price, reorder_level];

    const result = await client.query(query, values);

    res.status(201).json({
      message: 'Product created successfully',
      product: result.rows[0]
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).send("Error creating product");
  }
};


module.exports = {
  getProductType,
  createProduct
}