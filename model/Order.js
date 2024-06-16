const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    order_id: { type: Number },
    user_id: { type: Number, required: true, ref: 'User' },
    payment_status: { type: String, required: true },
    total_price: { type: Number, required: true },
    delivery_charge: { type: Number, required: true },
    address_id: { type: Number, required: true },
    order_items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrderItem' }]
});

// Pre-save hook to set the order_id field
OrderSchema.pre('save', async function(next) {
    if (!this.isNew) {
        return next();
    }

    try {
        const count = await this.constructor.countDocuments();
        this.order_id = count + 1;
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('Order', OrderSchema);
