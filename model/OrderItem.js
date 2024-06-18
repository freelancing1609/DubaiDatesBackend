const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
    order_item_id: { type: Number },
    order_id: { type: mongoose.Schema.ObjectId, required: true, ref: 'Order' },
    product_id: { type: Number, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    name: { type: String },
    weight: { type: Number },
    stock_level: { type: Number },
    delivery_expected: { type: Date },
    delivery_status: { type: String, default: "Pending" },
    coupon_id: { type: Number, ref: 'Coupon' }
});

// Pre-save hook to set the order_item_id field
OrderItemSchema.pre('save', async function(next) {
    if (!this.isNew) {
        return next();
    }

    try {
        const count = await this.constructor.countDocuments();
        this.order_item_id = count + 1;
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('OrderItem', OrderItemSchema);
