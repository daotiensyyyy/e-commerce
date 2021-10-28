const mongoose = require("mongoose");
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;


const User = new Schema({
    username: String,
    // email: String,
    password: String,
    roles: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role"
        }
    ]
}, { timestamps: true });


User.plugin(mongooseDelete, {
    deletedAt: true,
});
module.exports = mongoose.model('User', User);