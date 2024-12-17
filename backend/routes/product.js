const express = require('express');

// store routes
const router = express.Router();

// middleware
const upload = require('../middleware/multerConfig');

// controllers
const {
  getProduct,
  getProductType,
  createProduct
} = require('../controllers/ProductController');


// routes
router.get('/', getProduct);
router.get('/types', getProductType);
router.post('/create', upload, createProduct);




// exporting router
module.exports = router;