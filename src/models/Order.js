const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderItem = new Schema({
    productId: {
        type: String,
    },
    name: {
        type: String,
    },
    qty: {
        type: Number,
        min: [1, 'Quantity can not be less then 1.']
    },
    price: {
        type: Number,
        min: [0, 'Price can not be less then 0.']
    }
});

const Order = new Schema({
    code: {
        type: String,
    },
    billingAddress: {
        customerName: {
            type: String,
        },
        customerEmail: {
            type: String,

        },
        customerAddress: {
            type: String,
        },
        customerPhone: {
            type: String,
        }
    },
    shippingMethod: {
        type: String,
    },
    paymentMethod: {
        type: String,
        default: '"cash_on_delivery"'
    },
    grandTotal: {
        type: Number,
        min: [0, 'Price can not be less then 0.']
    },
    items: [OrderItem],
}, { timestamps: true });

module.exports = mongoose.model('Order', Order);
