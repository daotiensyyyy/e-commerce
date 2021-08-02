const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const Category = (new Schema({
    name: String,
    description: String,
}, { timestamps: true }));

Category.plugin(mongooseDelete, {
    deletedAt: true,
});

module.exports = mongoose.model("Category", Category);