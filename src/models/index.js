const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./User");
db.role = require("./Role");
db.product = require("./Product");
db.category = require("./Category");
db.order = require("./Order");

db.ROLES = ["admin"];

module.exports = db;