const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
const mongooseDelete = require('mongoose-delete');
mongoose.plugin(slug);

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
    slug: { type: String, slug: 'name' },
}, { timestamps: true });

Product.plugin(mongooseDelete, {
    deletedAt: true,
});


module.exports = mongoose.model("Product", Product);