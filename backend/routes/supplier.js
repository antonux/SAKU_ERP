const express = require('express');

// store routes
const router = express.Router();

// middleware
const upload = require('../middleware/multerConfig');

// controllers
const {
  getSupplier,
  createSupplier
} = require('../controllers/SupplierController');


// routes
router.get('/', getSupplier);
router.post('/create', createSupplier);




// exporting router
module.exports = router;