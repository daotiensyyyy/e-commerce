const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartItem = new Schema({
    productId: String,
    qty: Number
});

const Cart = new Schema({
    userId: String,
    items: [CartItem],

}, { timestamps: true });

Cart.statics = {
    /**
     * get cart
     */
    get({ userId } = {}) {
        let condition = { userId: userId };
        return this.findOne(condition).exec();
    }
};

module.exports = mongoose.model('Cart', Cart);