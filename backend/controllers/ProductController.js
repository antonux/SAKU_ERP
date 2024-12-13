const client = require('../connection');

const getProductType  = async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM PRODUCT_TYPE;');
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("Error fetching data");
    }
}

module.exports = {
  getProductType
}