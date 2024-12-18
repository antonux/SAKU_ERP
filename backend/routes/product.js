const express = require('express');

// store routes
const router = express.Router();

// middleware
const upload = require('../middleware/multerConfig');

// controllers
const {
  getProduct,
  getProductType,
  createProduct,
  deleteProduct,
  updateProduct
} = require('../controllers/ProductController');


// routes
router.get('/', getProduct);
router.get('/types', getProductType);
router.post('/create', upload, createProduct);
router.post('/update', upload, updateProduct);
router.delete('/delete/:prod_id', deleteProduct);




// exporting router
module.exports = router;