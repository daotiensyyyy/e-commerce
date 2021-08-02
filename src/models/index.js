const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./User");
db.role = require("./Role");
db.product = require("./Product");
db.category = require("./Category");
db.cart = require("./Cart");
db.order = require("./Order");

db.ROLES = ["member", "admin", "moderator", "seller", "guest"];

module.exports = db;