const express = require('express');

const router = express.Router();

const upload = require('../middleware/multerConfig');

const {
  createRestockRequest,
  getRestockRequest,
  updateRequest,
  deleteRequest
} = require('../controllers/RequestController');

router.get('/restock', getRestockRequest);
router.post('/create/restock', createRestockRequest);
router.delete('/delete/:rf_id', deleteRequest);
router.post('/update', updateRequest);
// router.post('/update', upload, updateUser);
// router.post('/login', loginUser);

module.exports = router;

