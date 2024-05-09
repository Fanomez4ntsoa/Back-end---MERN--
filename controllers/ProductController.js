const asyncHandler = require("express-async-handler");
const ProductService = require("../services/ProductService");
const errorMessage = require('../resources/lang/fr/errorMessage');
const successMessage = require('../resources/lang/fr/successMessage');

/**
 * @description Fetch All products
 * @route GET /api/products/
 * @access Public
 */
const getProducts = asyncHandler(async(req, res) => {
    const productService = new ProductService();
    const pageSize = 10;
    const pageNumber = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keywords || '';
    const category = req.query.category || '';
    const brand = req.query.brand || '';

    const result = await productService.allProducts(pageNumber, pageSize, keyword, category, brand);
    res.json({
      message: successMessage.product.collection_products, 
      data: result
    });
})

/**
 * @description Create Product
 * @route POST /api/products/
 * @access Private/Admin
 */
const createProduct = asyncHandler(async(req, res) => {
    const productService = new ProductService();
    const {
        name,
        image,
        brand,
        category,
        description,
        numReviews,
        price,
        countInStock
    } = req.body;
    
    try {
      const createdProduct = await productService.create({
        user: req.user._id,
        name,
        image,
        brand,
        category,
        description,
        numReviews,
        price,
        countInStock
      });

      if(createdProduct) {
        res.status(201).json({
          message: successMessage.product.created,
          data: {
            _id: createdProduct._id,
            user: req.user._id,
            name: createdProduct.name,
            brand: createdProduct.brand,
            category: createdProduct.category,
            description: createdProduct.description,
            price: createdProduct.price,
            countInStock: createdProduct.countInStock
          }
        });
      } else {
        res.status(400).json({ message: errorMessage.product.invalid_data });
      }
  
    } catch (error) {
      res.status(500).json({ message: errorMessage.default });
    }
});

/**
 * @description Get Product by Id
 * @route GET /api/products/:id
 * @access Public
 */
const getProductById = asyncHandler(async(req, res) => {
    try {
        const productService = new ProductService();
        const product = await productService.getById(req.params.id);

        if(!product) {
            res.status(403).json({ message: errorMessage.product.not_product });
        } else {
            res.status(200).json({
                message: successMessage.product.informations,
                data: {
                    _id: product._id,
                    name: product.name,
                    brand: product.brand,
                    category: product.category,
                    description: product.description,
                    rating: product.rating,
                    price: product.price,
                    countInStock: product.countInStock,
                    reviews: product.reviews
                }
            })
        }
    } catch (error) {
        res.status(500).json({ message: `${errorMessage.default}` });
    }
    
});

/**
 * @description Update Product
 * @route PUT /api/products/:id
 * @access Private/Admin
 */
const updateProduct = asyncHandler(async(req, res) => {
    const productService = new ProductService();
    const updated = await productService.update(req.params.id, req.body);
    res.json({
        message: successMessage.product.updated,
        data: updated
    });
});

/**
 * @description Delete Product
 * @route DELETE /api/products/:id
 * @access Private/Admin
 */
const deleteProduct = asyncHandler(async(req, res) => {
    const productService = new ProductService();
    const deleted = await productService.delete(req.params.id);
    if(!deleted) {
        res.status(403).json({ message: errorMessage.product.deleted });  
    }
    res.json({ message: successMessage.product.deleted, data: deleted });
});

/**
 * @description Create review for product
 * @route POST /api/products/:id/reviews
 * @access Private
 */
const createProductReview = asyncHandler(async (req, res) => {
    const productService = new ProductService();
    const { rating, comment } = req.body;
  
    try {
      await productService.productReview(
        req.params.id,
        req.user,
        rating,
        comment
      );
  
      res.status(201).json({ message: successMessage.product.add_review });
    } catch (error) {
      res.status(500).json({ message: errorMessage.default });
    }
});

/**
 * @description Get top rated products
 * @route GET /api/products/top
 * @access Public
 */
const getTopProducts = asyncHandler(async (req, res) => {
    const productService = new ProductService();
    const topProducts = await productService.topProducts();
    res.json({ 
        message: successMessage.product.top, 
        data: topProducts 
    });
});

/**
 * @description Delete review on product by id
 * @route DELETE /api/products/:id/reviews/:id
 * @access Private
 */
const deleteReview = asyncHandler(async (req, res) => {
    const productService = new ProductService();
    const { productId, reviewsId } = req.params;

    try {
        const result = await productService.deleteReview(productId, reviewsId, req.user._id);
        if(!result) {
            res.status(result.status).json({ message: result.message });
        }
        res.status(result.status).json({ message: result.message });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

module.exports = { getProducts, createProduct, getProductById, updateProduct, deleteProduct, createProductReview, getTopProducts, deleteReview };