const OrderService = require('../services/OrderService');
const asyncHandler = require("express-async-handler");

/**
 * @description Get All orders
 * @route GET /api/orders/
 * @access Private/Admin
 */
const getOrders = asyncHandler(async(req, res) => {
    const orderService = new OrderService();
    try {
        const orders = await orderService.allOrders()
        if(orders === 0) {
            res.status(400).json({ message: 'No orders for now'});
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

/**
 * @description Create an order
 * @route POST /api/order/
 * @access Private
 */
const createOrder = asyncHandler(async(req, res) => {
    const orderService = new OrderService();
    const { 
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body;

    try {
        if (!orderItems || orderItems.length === 0) {
            res.status(400);
            throw new Error('No order items');
          }
        
          const orderData = {
            orderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
          };
        
          const createdOrder = await orderService.create(orderData);
          res.json(201).json({
                _id: createdOrder._id,
                user: req.user._id,
                name: createdOrder.name,
                brand: createdOrder.brand,
                category: createdOrder.category,
                description: createdOrder.description,
                price: createdOrder.price,
                countInStock: createdOrder.countInStock
          });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @description Get order by Id
 * @route GET /api/order/:id
 * @access Private
 */
const getOrderById = asyncHandler(async(req, res) => {
    try {
        const orderService = new OrderService();
        const order = await orderService.getById(req.params.id).populate(
            'user',
            'name email'
        );

        if(order) {
            res.json(order)
        } else {
            res.status(404)
            throw new Error('Order not found')
        }   
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

/**
 * @description Updated order to paid
 * @route GET /api/order/:id/pay
 * @access Private
 */
const updateOrderToPaid = asyncHandler(async (req, res) => {
    const orderService = new OrderService();
    const { id, status, update_time, payer } = req.body;
    const orderId = req.params.id;

    try {
        const updatedOrder = await orderService.updateOrderToPaid(orderId, {
            id,
            status,
            update_time,
            payer,
        });

        res.json(updatedOrder);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @description Updated order to delivered
 * @route GET /api/order/:id/devivered
 * @access Private/Admin
 */
const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const orderId = req.params.id;
    const orderService = new OrderService();

    try {
        const updatedOrder = await orderService.updateOrderToDelivered(orderId);
        res.json(updatedOrder);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @description Get logged in user orders
 * @route GET /api/order/myorders
 * @access Private/Admin
 */
const getMyOrders = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const orderService = new OrderService();

    try {
        const orders = await orderService.getMyOrders(userId);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = { getOrders, createOrder, getOrderById, updateOrderToDelivered, updateOrderToPaid, getMyOrders }