const express = require('express')

const router = express.Router()

const { getProductType } = require('../controllers/ProductController')


router.get('/types', getProductType)


module.exports = router