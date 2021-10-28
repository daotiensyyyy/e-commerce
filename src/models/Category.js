const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const Schema = mongoose.Schema;

const Category = (new Schema({
    name: String,
    description: String,
    slug: { type: String, slug: 'name' },
}, { timestamps: true }));

Category.plugin(mongooseDelete, {
    deletedAt: true,
});

module.exports = mongoose.model("Category", Category);