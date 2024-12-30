const express = require('express');

const router = express.Router();

const upload = require('../middleware/multerConfig');

const {
    getPurchaseRequest,
    receivePurchase,
    createPurchaseRequest,
    getDeliveryReceipts
} = require('../controllers/PurchaseController');

router.get('/purchaseRequest', getPurchaseRequest);
router.get('/receive', getDeliveryReceipts);
router.post('/create/purchase', createPurchaseRequest);
router.post('/create/receive', receivePurchase);


// router.post('/update', upload, updateUser);
// router.post('/login', loginUser);

module.exports = router;

