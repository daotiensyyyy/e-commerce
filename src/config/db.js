const mongoose = require('mongoose');
const db = require("../models");
const Role = db.role;

async function connect() {
    try {
        await mongoose.connect('mongodb://localhost:27017/nodejs-restful-api', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        console.log('Connect successfully!!!');
    } catch (error) {
        console.log('Failure!!!');
    }
}

function initial() {
    Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new Role({
                name: "user"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'user' to roles collection");
            });

            new Role({
                name: "moderator"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'moderator' to roles collection");
            });

            new Role({
                name: "admin"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'admin' to roles collection");
            });

            new Role({
                name: "seller"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'seller' to roles collection");
            });
        }
    });
}

module.exports = { connect, initial };