const mongoose = require("mongoose");
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const Product = new Schema({
    name: String,
    price: Number,
    description: String,
    categories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category"
        }
    ],
    image: {
        type: String
    },
}, { timestamps: true });

Product.plugin(mongooseDelete, {
    deletedAt: true,
});

module.exports = mongoose.model("Product", Product);