/**
 * @interface
 * @template T
 */
class OrderServiceInterface {

    /**
     * @returns {Promise<T|null>}
     */
    allOrders() {}

    /**
     * @param {string} id
     * @returns {Promise<T|null>}
     */
    updateOrderPaid(id) {}

    /**
     * @param {string} id
     * @returns {Promise<T|null>}
     */
    updateOrderToDelivered(id) {}

    /**
     * @param {string} id 
     * @returns {Promise<T|null>}
     */
    getMyOrders(id) {}

}

module.exports = OrderServiceInterface;