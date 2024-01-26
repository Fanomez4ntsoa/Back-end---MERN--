/**
 * @interface
 * @template T
 */
class ProductServiceInterface {

    /**
     * @returns {Promise<T|null>}
     */
    allProducts() {}

   /**
    * 
    * @param {string} productId 
    * @param {object} user 
    * @param {number} rating 
    * @param {string} comment 
    */
    productReview(productId, user, rating, comment) {}

    /**
     * @returns {Promise<T|null>}
     */
    topProducts() {}

    /**
     * 
     * @param {string} productId 
     * @param {string} reviewId 
     */
    deleteReview(productId, reviewId) {}

}

module.exports = ProductServiceInterface;