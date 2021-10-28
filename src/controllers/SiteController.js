// This file contains controllers that can be used by user, admin, moderator,....
require('dotenv').config();
const config = require("../config/auth");
const db = require("../models");
const User = db.user;
const Role = db.role;
const Product = db.product;
const Category = db.category;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


class SiteController {

    //[POST] /api/signup
    signup = (req, res) => {
        const user = new User({
            username: req.body.username,
            // email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8)
        });

        user.save((err, user) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            if (req.body.roles) {
                Role.find(
                    {
                        name: { $in: req.body.roles }
                    },
                    (err, roles) => {
                        if (err) {
                            res.status(500).send({ message: err });
                            return;
                        }

                        user.roles = roles.map(role => role._id);
                        user.save(err => {
                            if (err) {
                                res.status(500).send({ message: err });
                                return;
                            }

                            res.send({ message: "User was registered successfully!" });
                        });
                    }
                );
            } else {
                Role.findOne({ name: "guest" }, (err, role) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }

                    user.roles = [role._id];
                    user.save(err => {
                        if (err) {
                            res.status(500).send({ message: err });
                            return;
                        }

                        res.send({ message: "User was registered successfully!" });
                    });
                });
            }
        });
    };

    //[POST] /api/signin
    signin = (req, res) => {
        User.findOne({
            username: req.body.username
        })
            .populate("roles", "-__v")
            .exec((err, user) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                if (!user) {
                    return res.status(404).send({ message: "User Not found." });
                }

                let passwordIsValid = bcrypt.compareSync(
                    req.body.password,
                    user.password
                );


                let token = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, {
                    expiresIn: '1h'
                });

                let authorities = [];

                for (let i = 0; i < user.roles.length; i++) {
                    authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
                }

                if (!passwordIsValid) {
                    res.sendStatus(401);
                } else {
                    res.status(200)
                        .cookie('access_token', token, {
                            maxAge: 365 * 24 * 60 * 60 * 100,
                            httpOnly: true,
                            // secure: true;
                        })
                        .send({
                            id: user._id,
                            username: user.username,
                            email: user.email,
                            roles: authorities,
                            accessToken: token,
                            isSuccess: 1,
                            status: 200,
                        });
                }
            });
    };

    //[POST] /api/signout
    signOut = (req, res) => {
        res
            .status(202)
            .clearCookie('access_token').send("Logged out!")
    }

    //[GET] /api/all-products
    getAllProducts = (req, res) => {
        Product.find({ deleted: false }).lean().populate("categories", "-__v")
            .then(products => {
                if (!products) {
                    return res.status(404).send('No data');
                }
                res.status(200).json(products);
            })
            .catch(err => {
                return res.status(500).send(err.message);
            });
    }

    //[GET] /api/product/:id
    getProductById = (req, res) => {
        Product.findById({ _id: req.params.id, deleted: false }).lean().populate("categories", "-__v")
            .then(product => {
                if (!product) {
                    return res.status(404).send('product not found');
                }
                res.status(200).json(product);
            })
            .catch(err => {
                if (err.kind == 'ObjectId') {
                    return res.status(404).send('product not found');
                }
                return res.status(404).send(err.message);
            });
    }

    //[GET] /api/product/:slug
    getProductBySlug = (req, res) => {
        Product.findOne({ slug: req.params.slug, deleted: false }).lean().populate("categories", "-__v")
            .then(product => {
                if (!product) {
                    return res.status(404).send('product not found');
                }
                res.status(200).json(product);
            })
            .catch(err => {
                if (err.kind == 'ObjectId') {
                    return res.status(404).send('product not found');
                }
                return res.status(404).send(err.message);
            });
    }

    //[GET] /api/all-categories
    getAllCategories = (req, res) => {
        Category.find().lean()
            .then(categories => {
                if (!categories) {
                    return res.status(404).send('No data');
                }
                res.status(200).json(categories);
            })
            .catch(err => {
                return res.status(500).send(err.message);
            });
    }

    //[GET] /api/category/:id/product
    getProductFilteredByCategory = (req, res) => {
        Product.find({ categories: req.params.id, deleted: false }).lean().populate("categories", "-__v")
            .then(product => {
                if (!product) {
                    return res.status(404).send('Product not found');
                }
                res.status(200).json(product);
            })
            .catch(err => {
                if (err.kind == 'ObjectId') {
                    return res.status(404).send('Product not found');
                }
                return res.status(404).send(err.message);
            });
    }

    // //[POST] /api/add-to-cart
    // addToCart = (req, res) => {
    //     const { email, productId } = req.body;
    //     const qty = Number.parseInt(req.body.qty);
    //     Cart.findOne({ userId: email })
    //         .exec()
    //         .then(cart => {
    //             if (!cart && qty <= 0) {
    //                 throw new Error('Invalid request');
    //             } else if (cart) {
    //                 const indexFound = cart.items.findIndex(item => {
    //                     return item.productId === productId;
    //                 });
    //                 if (indexFound !== -1 && qty <= 0) {
    //                     cart.items.splice(indexFound, 1);
    //                 } else if (indexFound !== -1) {
    //                     cart.items[indexFound].qty = cart.items[indexFound].qty + qty;
    //                 } else if (qty > 0) {
    //                     cart.items.push({
    //                         productId: productId,
    //                         qty: qty
    //                     });
    //                 } else {
    //                     throw new Error('Invalid request');
    //                 }
    //                 return cart.save();
    //             } else {
    //                 const cartData = {
    //                     userId: email,
    //                     items: [
    //                         {
    //                             productId: productId,
    //                             qty: qty
    //                         }
    //                     ]
    //                 };
    //                 cart = new Cart(cartData);
    //                 return cart.save();
    //             }
    //         })
    //         .then(savedCart => res.json(savedCart))
    //         .catch(err => {
    //             if (err.message === 'Invalid request') {
    //                 return res.send(err.message);
    //             }
    //             return res.send(err.message);
    //         });
    // }

    // //[POST] /api/add-to-cart  /* update qty item */
    // updateQty = (req, res, next) => {
    //     const { email, productId } = req.body;
    //     const qty = Number.parseInt(req.body.qty);
    //     Cart.findOne({ userId: email })
    //         .then(cart => {
    //             if (!cart || qty <= 0) {
    //                 throw new Error('Invalid request');
    //             } else {
    //                 const indexFound = cart.items.findIndex(item => {
    //                     return item.productId === productId;
    //                 });
    //                 if (indexFound !== -1) {
    //                     let updatedQty = cart.items[indexFound].qty - qty;
    //                     if (updatedQty <= 0) {
    //                         cart.items.splice(indexFound, 1);
    //                     } else {
    //                         cart.items[indexFound].qty = updatedQty;
    //                     }
    //                     return cart.save();
    //                 } else {
    //                     throw new Error('Invalid request');
    //                 }
    //             }
    //         })
    //         .then(updatedCart => res.json(updatedCart))
    //         .catch(err => {
    //             if (err.message === 'Invalid request') {
    //                 return res.send('Invalid request');
    //             } return res.send(err.message);

    //         });
    // };

    // //[GET] /member/api/:id/cart
    // getCart = (req, res) => {
    //     Cart.findOne({ userId: req.params.id }).lean()
    //         .then(cart => {
    //             if (!cart) {
    //                 return res.status(404).send('Cart not found');
    //             }
    //             res.status(200).json(cart);
    //         })
    //         .catch(err => {
    //             if (err.kind == 'ObjectId') {
    //                 return res.status(404).send('Cart not found');
    //             }
    //             return res.status(500).send(err.message);
    //         });
    // }

}

module.exports = new SiteController;