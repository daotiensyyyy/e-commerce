const mongoose = require('mongoose');
const db = require("../models");
const Role = db.role;

async function connect() {
    try {
        // await mongoose.connect('mongodb+srv://dbUser:123456zxc@cluster0.jwawn.mongodb.net/nodejs-restful-api?retryWrites=true&w=majority', {
        await mongoose.connect('mongodb://localhost:27017/tea', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        console.log('Connect successfully!!!');
    } catch (error) {
        console.log('Error connecting', error);
        console.log('Failure!!!');
    }
}

function initial() {
    Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new Role({
                name: "admin"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'admin' to roles collection");
            });
        }
    });
}

module.exports = { connect, initial };