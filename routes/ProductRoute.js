const express = require('express');
const { getProducts, createProduct, createProductReview, getTopProducts, getProductById, deleteProduct, updateProduct, deleteReview } = require('../controllers/ProductController');
const { protect, admin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.route('/').get(getProducts)
router.route('/').post(protect, admin, createProduct)
router.route('/:id/reviews').post(protect, createProductReview)
router.route('/:productId/reviews/:reviewsId').delete(protect, deleteReview)
router.get('/top', getTopProducts)
router.route('/:id')
    .get(getProductById)
    .delete(protect, admin, deleteProduct)
    .put(protect, admin, updateProduct)


module.exports = router;