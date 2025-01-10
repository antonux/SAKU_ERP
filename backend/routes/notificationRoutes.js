const express = require('express');

const router = express.Router();

const upload = require('../middleware/multerConfig');

const {
    createNotification
} = require('../controllers/NotificationController');

router.post('/create', createNotification);
// router.get('/', getUsers);
// router.post('/create', upload, createUser);
// router.post('/update', upload, updateUser);
// router.post('/login', loginUser);
// router.delete('/delete/:user_id', deleteUser);

module.exports = router;

