const express = require('express');

const router = express.Router();

const upload = require('../middleware/multerConfig');

const {
    getPurchaseRequest,
    getApprovedProducts,
    receivePurchase,
    createPurchaseRequest,
    getDeliveryReceipts,
    approveProduct
} = require('../controllers/PurchaseController');

router.get('/purchaseRequest', getPurchaseRequest);
router.get('/receive', getDeliveryReceipts);
router.get('/approve/:dr_id', getApprovedProducts);
router.post('/create/receive', receivePurchase);
router.post('/create/purchase', createPurchaseRequest);
router.post('/approve', approveProduct);


// router.post('/update', upload, updateUser);
// router.post('/login', loginUser);

module.exports = router;

