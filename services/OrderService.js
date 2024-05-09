const BaseService = require("./BaseService");
const OrderModel = require('../models/OrderModel');

class OrderService extends BaseService {
    constructor() {
        super(OrderModel);
    }

    /**
     * Récuperer tous les commandes
     * 
     * @returns {Promise<void>}
     */
    async allOrders() {
        try {
            const order = await OrderModel.find({});
            if(!order) {
                throw new Error(`Current orders not available : ${error.message}`)
            } else {
                return order;
            }
        } catch (error) {
            throw new Error(`Error on getting all orders : ${error.message}`)
        }
    }

    /**
     * Mise à jour des commandes à payer
     * 
     * @param {string} orderId
     * @param {string} paymentInfo 
     */
    async updateOrderPaid(orderId, paymentInfo) {
        try {
            const order = await OrderModel.getById(orderId)

            if(!order) {
                throw new Error(`${OrderModel.modelName} not found`);
            } else {
                order.isPaid = true;
                order.paidAt = Date.now();
                order.paymentResult = {
                    id: paymentInfo.id,
                    status: paymentInfo.status,
                    update_time: paymentInfo.update_time,
                    email_address: paymentInfo.payer.email_address,
                };
            }
            const updatedOrder = await order.update(orderId, order)
            return updatedOrder;
        } catch (error) {
            throw new Error(`Error on updating the orders : ${error.message}`);
        }
    }

    /**
     * Mise à jour des commandes à livrer
     * 
     * @param {string} orderId
     * @returns 
     */
    async updateOrderToDelivered(orderId) {
        try {
            const order = await this.getById(orderId);

            if (order) {
                order.isDelivered = true;
                order.deliveredAt = Date.now();

                const updatedOrder = await this.update(orderId, order);
                return updatedOrder;
            } else {
                throw new Error('Order not found');
            }
        } catch (error) {
            throw new Error(`Error on updating order to delivered: ${error.message}`);
        }
    }

    /**
     * Récupération de tous les commandes d'un utilisateur
     * 
     * @param {string} userId 
     * @returns 
     */
    async getMyOrders(userId) {
        try {
            const orders = await OrderModel.find({ user: userId });
            return orders;
        } catch (error) {
            throw new Error(`Error on getting user orders: ${error.message}`);
        }
    }
}

module.exports = OrderService;