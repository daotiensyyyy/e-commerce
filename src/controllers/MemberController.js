const Product = require("../models/Product");
const Cart = require("../models/Cart");
const Category = require("../models/Category");

class UserController {

    //[GET] /member/api/all-products
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

    //[GET] /member/api/product/:id
    getProductById = (req, res) => {
        Product.findById({ _id: req.params.id, deleted: false }).lean().populate("categories", "-__v")
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

    //[GET] /member/api/category/:id/product
    getProductFilteredByCategory = (req, res) => {
        Product.find({ categories: req.params.id }).lean().populate("categories", "-__v")
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

    //[POST] /member/api/add-to-cart
    addToCart = (req, res) => {
        const { userId, productId } = req.body;
        const qty = Number.parseInt(req.body.qty);
        Cart.findOne({ userId: userId })
            .exec()
            .then(cart => {
                if (!cart && qty <= 0) {
                    throw new Error('Invalid request');
                } else if (cart) {
                    const indexFound = cart.items.findIndex(item => {
                        return item.productId === productId;
                    });
                    if (indexFound !== -1 && qty <= 0) {
                        cart.items.splice(indexFound, 1);
                    } else if (indexFound !== -1) {
                        cart.items[indexFound].qty = cart.items[indexFound].qty + qty;
                    } else if (qty > 0) {
                        cart.items.push({
                            productId: productId,
                            qty: qty
                        });
                    } else {
                        throw new Error('Invalid request');
                    }
                    return cart.save();
                } else {
                    const cartData = {
                        userId: userId,
                        items: [
                            {
                                productId: productId,
                                qty: qty
                            }
                        ]
                    };
                    cart = new Cart(cartData);
                    return cart.save();
                }
            })
            .then(savedCart => res.json(savedCart))
            .catch(err => {
                if (err.message === 'Invalid request') {
                    return res.send(err.message);
                }
                return res.send(err.message);
            });
    }

    //[POST] /member/api/add-to-cart  /* update qty item */
    updateQty = (req, res, next) => {
        const { userId, productId } = req.body;
        const qty = Number.parseInt(req.body.qty);
        Cart.findOne({ userId: userId })
            .then(cart => {
                if (!cart || qty <= 0) {
                    throw new Error('Invalid request');
                } else {
                    const indexFound = cart.items.findIndex(item => {
                        return item.productId === productId;
                    });
                    if (indexFound !== -1) {
                        let updatedQty = cart.items[indexFound].qty - qty;
                        if (updatedQty <= 0) {
                            cart.items.splice(indexFound, 1);
                        } else {
                            cart.items[indexFound].qty = updatedQty;
                        }
                        return cart.save();
                    } else {
                        throw new Error('Invalid request');
                    }
                }
            })
            .then(updatedCart => res.json(updatedCart))
            .catch(err => {
                if (err.message === 'Invalid request') {
                    return res.send('Invalid request');
                } return res.send(err.message);

            });
    }

    //[GET] /member/api/:id/cart
    getCart = (req, res) => {
        Cart.findOne({ userId: req.params.id }).lean()
            .then(cart => {
                if (!cart) {
                    return res.status(404).send('Cart not found');
                }
                res.status(200).json(cart);
            })
            .catch(err => {
                if (err.kind == 'ObjectId') {
                    return res.status(404).send('Cart not found');
                }
                return res.status(500).send(err.message);
            });
    }

}

module.exports = new UserController;