const express = require('express');
const { getProducts, createProduct } = require('../controllers/ProductController');
const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, createProduct)