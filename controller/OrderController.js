const express = require('express');
const router = express.Router();
const Order = require('../model/Order');
const OrderItem = require('../model/OrderItem');
const ErrorHandler = require("../utils/ErrorHandler");
const {isAuthenticated} = require("../middleware/auth");
const { isAdmin } = require('../middleware/admin');
const moment = require('moment');

// Create a new order
router.post('/create', isAuthenticated, async (req, res, next) => {
    const { user_id, payment_status, total_price, delivery_charge, address_id, order_items } = req.body;
    try {
        // Create Order
        const order = new Order({
            user_id,
            payment_status,
            total_price,
            delivery_charge,
            address_id,
            order_items: [] // Temporarily empty, will update later
        });
        await order.save();

        // Create OrderItems and update with order_id
        const createdOrderItems = await Promise.all(order_items.map(async item => {

            const orderItem = new OrderItem({
                order_id: order._id,
                product_id: item.product_id,
                quantity: item.quantity,
                price: item.price,
                image: item.image,
                name: item.name,
                weight: item.weight,
                stock_level: item.stock_level,
                delivery_expected:  item.delivery_expected?moment(item.delivery_expected, "DD/MM/YYYY").toDate():null,
                delivery_status: item.delivery_status,
                coupon_id: item.coupon_id
            });
            return await orderItem.save();
        }));

        // Update Order with created OrderItems
        order.order_items = createdOrderItems.map(item => item._id);
        await order.save();

        res.status(201).json({ success: true, order });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
});

// Get all orders
router.get('/all', isAdmin, async (req, res, next) => {
    try {
        const orders = await Order.find().populate('order_items');
        res.status(200).json({ success: true, orders });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
});

// Get orders by user ID
router.get('/user/:user_id', isAuthenticated, async (req, res, next) => {
    const { user_id } = req.params;
    try {
        const orders = await Order.find({ user_id }).populate('order_items');
        res.status(200).json({ success: true, orders });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
});

// Get orders by product ID
router.get('/product/:product_id', isAdmin, async (req, res, next) => {
    const { product_id } = req.params;
    try {
        const orderItems = await OrderItem.find({ product_id });
        const orderIds = orderItems.map(item => item.order_id);
        const orders = await Order.find({ _id: { $in: orderIds } }).populate('order_items');
        res.status(200).json({ success: true, orders });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
});

module.exports = router;
