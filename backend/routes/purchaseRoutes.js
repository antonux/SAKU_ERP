const express = require('express');

const router = express.Router();

const upload = require('../middleware/multerConfig');

const {
    getPurchaseRequest,
    createPurchaseRequest
} = require('../controllers/PurchaseController');

router.get('/purchaseRequest', getPurchaseRequest);
router.post('/create/purchase', createPurchaseRequest);


// router.post('/update', upload, updateUser);
// router.post('/login', loginUser);

module.exports = router;

