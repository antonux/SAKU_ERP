const express = require('express');

const router = express.Router();

const upload = require('../middleware/multerConfig');

const {
    getRecentCheckedDeliveryReceiptByPO,
    getAllCheckedDeliveryReceiptsByPO,
    getPurchaseRequest,
    getApprovedProducts,
    receivePurchase,
    createPurchaseRequest,
    getDeliveryReceipts,
    approveProduct,
    getReceivingMemo
} = require('../controllers/PurchaseController');

router.get('/purchaseRequest', getPurchaseRequest);
router.get('/receiving-memo', getReceivingMemo);
router.get('/recent-receipt/:po_id/:dr_id', getRecentCheckedDeliveryReceiptByPO);
router.get('/all-checked/:po_id', getAllCheckedDeliveryReceiptsByPO);
router.get('/receive', getDeliveryReceipts);
router.get('/approve/:dr_id', getApprovedProducts);
router.post('/create/receive', receivePurchase);
router.post('/create/purchase', createPurchaseRequest);
router.post('/approve', approveProduct);


// router.post('/update', upload, updateUser);
// router.post('/login', loginUser);

module.exports = router;

