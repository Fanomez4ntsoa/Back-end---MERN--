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

}

module.exports = ProductServiceInterface;