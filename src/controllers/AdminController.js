const db = require('../models');
const jwt = require('jsonwebtoken')
// const fs = require('fs');
const Product = db.product;
const Category = db.category;
// const User = db.user;
const upload = require('../middleware/fileUpload');
require('dotenv').config();

class AdminController {

    //[GET] /api/admin/all-products
    getAllProducts = (req, res) => {
        const token = req.cookies.access_token;
        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            Product.find({ deleted: false }).lean().populate("categories", "-__v")
                .then(data => {
                    res.json(data);
                })
                .catch((err) => {
                    res.status(500).send({ message: err.message });
                });
        } catch (error) {
            res.status(400)
            throw error;
        }
    }

    //[GET] /api/admin/product/:id
    getProductById = (req, res) => {
        Product.findById({ _id: req.params.id }).lean().populate("categories", "-__v")
            .then(product => {
                if (!product) {
                    return res.status(404).json({
                        message: "Product not found!"
                    });
                }
                res.json(product);
            })
            .catch(err => {
                if (err.kind == 'ObjectId') {
                    return res.status(404).send({ message: 'Product not found' })
                }
                return res.status(500).send({ message: 'Error' });
            });
    }

    //[POST] /api/admin/create-product
    createProduct = async (req, res) => {
        const token = req.cookies.access_token;

        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            await upload(req, res);

            if (req.file == undefined) {
                return res.status(400).send({ message: "File error" });
            }
            const product = new Product({
                name: req.body.name,
                price: req.body.price,
                description: req.body.description,
                image: req.file.path,
            });
            product.save((err) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                if (req.body.categories) {
                    Category.find({ name: { $in: req.body.categories } }, (err, categories) => {
                        if (err) {
                            res.status(500).send({ message: err });
                            return;
                        }
                        product.categories = categories.map(category => category._id);
                        product.save((err, data) => {
                            if (data) {
                                res.status(200).json(data);
                                return;
                            } else {
                                res.status(500).send({ message: err });
                                return;
                            }
                        });
                    }
                    );
                }
                else {
                    res.send({ message: "Require category!" });
                }
            });
        } catch (err) {
            console.log(err);
            if (err.code == "LIMIT_FILE_SIZE") {
                return res.status(500).send({
                    message: "File size should be less than 5MB",
                });
            }
            res.status(500).send({
                message: `Error occured: ${err}`,
            });
        }


    }

    //[PUT] /api/admin/product/:id/edit
    editProductById = (req, res) => {
        Product.updateOne({ _id: req.params.id }, req.body)
            .then(product => {
                if (!product) {
                    return res.status(404).send({ message: 'Product not found!' });
                }
                Product.find({ _id: req.params.id }).lean()
                    .then(result => {
                        res.status(200).send(result);
                    })
            })
            .catch(err => {
                if (err.kind == 'ObjectId') {
                    return res.status(404).send({ message: 'Product not found' })
                }
                return res.status(500).send({ message: 'Error' });
            })
    }

    //[DELETE] /api/admin/product/:id/delete
    deleteProductById = (req, res) => {
        const token = req.cookies.access_token;
        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

            Product.findByIdAndDelete({ _id: req.params.id })
                .then((product) => {
                    return res.status(200).json(product);
                })
                .catch(err => {
                    if (err.kind == 'ObjectId') {
                        return res.status(500).send({ message: 'Product not found' });
                    }
                    return res.status(500).send({ message: 'Error' });
                });
        } catch (err) {
            console.log(err);
            res.status(500).send({
                message: `Error occured: ${err}`,
            });
        }
    }

    //[GET] /api/admin/trash/products
    getProductsDeleted = (req, res) => {
        Product.find({ deleted: true }).lean()
            .then((products) => {
                if (!products) {
                    return res.status(404).send({ message: 'No products found' });
                }
                res.status(200).json(products);
            })
            .catch((err) => {
                return res.status(500).send({ message: err.message });
            });
    }

    //[PATCH] /api/admin/trash/product/:id/restore
    restoreProductById = (req, res) => {
        Product.restore({ _id: req.params.id })
            .then(() => {
                Product.findById({ _id: req.params.id }).lean()
                    .then(product => {
                        return res.status(200).json(product);
                    })
            })
            .catch(err => {
                if (err.kind == 'ObjectId') {
                    return res.status(404).send({ message: 'Product not found' })
                }
                return res.status(500).send({ message: err.message });
            });
    }

    //[POST] /api/admin/create-category
    createCategory = (req, res) => {
        const token = req.cookies.access_token;

        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

            const category = new Category({
                name: req.body.name,
                description: req.body.description,
            });
            category.save((err, data) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                res.json(data);
            });
        } catch (err) {
            console.log(err);
            res.status(500).send({
                message: `Error occured: ${err}`,
            });
        }


    }
}

module.exports = new AdminController;