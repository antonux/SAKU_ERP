const express = require('express');

// store routes
const router = express.Router();

// middleware
const upload = require('../middleware/multerConfig');

// controllers
const {
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier
} = require('../controllers/SupplierController');


// routes
router.get('/', getSupplier);
router.post('/create', upload, createSupplier);
router.post('/update', upload, updateSupplier);
router.delete('/delete/:supplier_id', deleteSupplier);




// exporting router
module.exports = router;