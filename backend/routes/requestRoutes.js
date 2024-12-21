const express = require('express');

const router = express.Router();

const upload = require('../middleware/multerConfig');

const {
  createRestockRequest,
  getRestockRequest
} = require('../controllers/RequestController');

router.get('/restock', getRestockRequest);
router.post('/create/restock', createRestockRequest);
// router.post('/update', upload, updateUser);
// router.post('/login', loginUser);
// router.delete('/delete/:user_id', deleteUser);

module.exports = router;

