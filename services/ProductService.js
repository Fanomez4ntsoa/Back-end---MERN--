const BaseService = require("./BaseService");
const ProductServiceInterface = require('../contracts/ProductServiceInterface');
const ProductModel = require("../models/ProductModel");
const successMessage = require('../resources/lang/fr/successMessage');
const errorMessage = require("../resources/lang/fr/errorMessage");

/**
 * @implements (ProductServiceInterface)
 */
class ProductService extends BaseService {
    constructor() {
        super(ProductModel);
    }

    /**
     * Récuperer tous les produits
     * 
     * @param {number} pageNumber 
     * @param {number} pageSize 
     * @param {string} keywords 
     * @returns 
     */
    async allProducts(pageNumber = 1, pageSize = 10, keywords = '', category = '', brand = '') {
        const skip = pageSize * (pageNumber - 1);
        const query = {};

        if (keywords) {
            query.name = {
                $regex: keywords,
                $options: 'i',
            };
        }
        if (brand) {
            query.brand = brand;
        }
        if (category) {
            query.category = category;
        }

        const count = await this.model.countDocuments(query);
        const products = await this.model
            .find(query)
            .limit(pageSize)
            .skip(skip);

        return {
            products,
            page: pageNumber,
            pages: Math.ceil(count / pageSize),
        };
    }

    /**
     * Creation d'un nouveau review
     * 
     * @param {string} productId 
     * @param {object} user 
     * @param {number} rating 
     * @param {string} comment
     * @returns {Promise<void>}
     */
    async productReview(productId, user, rating, comment) {
        const product = await this.getById(productId);

        if(product) {
            const alreadyReviewed = product.reviews.find(
                (r) => r.user.toString() === user._id.toString()
            )

            if(alreadyReviewed) {
                throw new Error('Product already reviewed');
            }

            const review = {
                name: `${user.firstname} ${user.lastname}`,
                rating: Number(rating),
                comment,
                user: user._id,
            };

            product.reviews.push(review);
            product.numReviews = product.reviews.length;
            product.rating = 
                product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

            await product.save();
        } else {
            throw new Error('Product not found');
        }
    }

    /**
     * Recuperation des produits les mieux notés
     * 
     * @throws {Error}
     * @returns {Promise<Array>}
     */
    async topProducts() {
        return ProductModel.find({}).sort({rating: -1}).limit(3);
    }

    /**
     * Supprimer les reviews dans un produit
     * 
     * @param {string} productId 
     * @param {string} reviewId 
     */
    async deleteReview(productId, reviewId, userId) {
        const product = await this.model.findById(productId);
        if (!product) {
            return {
                status: 404,
                message: errorMessage.product.not_found
            }
        }

        const reviewIndex = product.reviews.findIndex(
            (review) => review._id.toString() === reviewId
        );
        if (reviewIndex === -1) {
            return {
                status: 404,
                message: errorMessage.product.review_not_found
            }
        }

        if (product.reviews[reviewIndex].user.toString() !== userId.toString() ) {
            return {
                status: 403,
                message: errorMessage.product.user_not_authorized
            }
        }

        product.reviews.splice(reviewIndex, 1);
        product.numReviews = product.reviews.length;

        if (product.numReviews > 0) {
            product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
        } else {
            product.rating = 0;
        }

        await product.save();
        return { status: 200, message: successMessage.product.review_deleted };
    }
}

module.exports = ProductService;