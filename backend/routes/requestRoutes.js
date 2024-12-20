const express = require('express');

const router = express.Router();

const upload = require('../middleware/multerConfig');

const {
  createRestockRequest
} = require('../controllers/RequestController');

// router.get('/', getUsers);
router.post('/create/restock', createRestockRequest);
// router.post('/update', upload, updateUser);
// router.post('/login', loginUser);
// router.delete('/delete/:user_id', deleteUser);

module.exports = router;

