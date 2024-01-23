const asyncHandler = require("express-async-handler");
const ProductService = require("../services/ProductService");

/**
 * @description Fetch All products
 * @route GET /api/products/
 * @access Public
 */
const getProducts = asyncHandler(async(req, res) => {
    const productService = new ProductService();
    const pageSize = 10;
    const pageNumber = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword || '';

    const result = await productService.allProducts(pageNumber, pageSize, keyword);
    res.json(result);
})

/**
 * @description Create Product
 * @route POST /api/products/
 * @access Private/Admin
 */
const createProduct = asyncHandler(async(req, res) => {
    const productService = new ProductService();
    const {
        user,
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
            _id: createdProduct._id,
            user: req.user._id,
            name: createdProduct.name,
            brand: createdProduct.brand,
            category: createdProduct.category,
            description: createdProduct.description,
            price: createdProduct.price,
            countInStock: createdProduct.countInStock
        });
      } else {
        res.status(400)
        throw new Error('Invalid user data');
      }
  
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

/**
 * @description Get Product by Id
 * @route GET /api/product/:id
 * @access Public
 */
const getProductById = asyncHandler(async(req, res) => {
    const productService = new ProductService();
    const product = await productService.getById(req.params.id);

    if(product) {
        res.json(product)
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

/**
 * @description Update Product
 * @route PUT /api/product/:id
 * @access Private/Admin
 */
const updateProduct = asyncHandler(async(req, res) => {
    const productService = new ProductService();
    const updated = await productService.update(req.params.id, req.body);
    res.json(updated);
});

/**
 * @description Delete Product
 * @route DELETE /api/product/:id
 * @access Private/Admin
 */
const deleteProduct = asyncHandler(async(req, res) => {
    const productService = new ProductService();
    const deleted = await productService.delete(req.params.id);
    res.json(deleted);
});

/**
 * @description Create review for product
 * @route POST /api/product/:id/reviews
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
  
      res.status(201).json({ message: 'Review added' });
    } catch (error) {
      res.status(400).json({ error: error.message });
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
    res.json(topProducts);
  });

module.exports = { getProducts, createProduct, getProductById, updateProduct, deleteProduct, createProductReview, getTopProducts };