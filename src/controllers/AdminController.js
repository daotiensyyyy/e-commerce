const db = require("../models");
const fs = require('fs');
const Category = require("../models/Category");
const Product = require("../models/Product");
const User = db.user;
const upload = require("../middleware/fileUpload");

class AdminController {

    /* USER */

    //[DELETE] /admin/api/user/:id
    delete = (req, res) => {
        User.delete({ _id: req.params.id })
            .then(() => res.json().status(200))
            .catch(err => {
                res.status(500).json({
                    message: err.message || "Some error occurred!"
                });
            });
    }

    //[PUT] /admin/api/user/:id/edit
    editUserById = (req, res) => {
        User.updateOne({ _id: req.params.id }, req.body)
            .then((user) => {
                if (!user) {
                    return res.status(404).send({
                        message: "User not found with!"
                    });
                }
                res.json(user);
            })
            .catch(err => {
                if (err.kind === 'ObjectId') {
                    return res.status(404).send({
                        message: "User not found!"
                    });
                }
                return res.status(500).send({
                    message: "Error updating user"
                });
            });
    }

    //[GET] /admin/api/user/:id
    getUserInfoById = (req, res) => {
        User.findById({ _id: req.params.id }).lean().populate("roles", "-__v")
            .then((user) => {
                if (!user) {
                    return res.status(404).json({
                        message: "user not found!"
                    });
                }
                res.json(user);
            }).catch(err => {
                if (err.kind === 'ObjectId') {
                    return res.status(404).send({
                        message: "User not found!"
                    });
                }
                return res.status(500).send({
                    message: "Error retrieving user!"
                });
            });
    };

    //[GET] /admin/api/all-users
    getAllUsers = (req, res) => {
        User.find({}).lean().populate("roles", "-__v")
            .then((data) => res.json(data))
            .catch(err => {
                res.status(500).json({
                    message: err.message || "Some error occurred!"
                });
            });
    };

    //[GET] /admin/api/all-products
    getAllProducts = (req, res) => {
        Product.find({ deleted: false }).lean().populate("categories", "-__v")
            .then(data => {
                res.json(data);
            })
            .catch((err) => {
                res.status(500).send({ message: err.message });
            });
    }

    //[GET] /admin/api/product/:id
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

    //[POST] /admin/api/create-product
    createProduct = async (req, res) => {
        try {
            await upload(req, res);

            if (req.file == undefined) {
                return res.status(400).send({ message: "Error" });
            }
            const product = new Product({
                name: req.body.name,
                price: req.body.price,
                description: req.body.description,
                image: req.file.path,
            });
            product.save((err, product) => {
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

    uploadFile = async (req, res) => {
        try {
            await upload(req, res);

            if (req.file == undefined) {
                return res.status(400).send({ message: "Choose a file to upload" });
            }

            res.status(200).json({
                fileUrl: 'http://localhost:3000/images/' + req.file.filename
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
    };

    //[PUT] /admin/api/product/:id/edit
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
                // res.status(200).json(product);
            })
            .catch(err => {
                if (err.kind == 'ObjectId') {
                    return res.status(404).send({ message: 'Product not found' })
                }
                return res.status(500).send({ message: 'Error' });
            })
    }

    //[DELETE] /admin/api/product/:id/delete
    deleteProductById = (req, res) => {
        Product.delete({ _id: req.params.id })
            .then((data) => {
                Product.findById({ _id: req.params.id }).lean()
                    .then(product => {
                        return res.status(200).json(product);
                    })
            })
            .catch(err => {
                if (err.kind == 'ObjectId') {
                    return res.status(500).send({ message: 'Product not found' });
                }
                return res.status(500).send({ message: 'Error' });
            });
    }

    //[GET] /admin/api/trash/products
    getProductsDeleted = (req, res) => {
        Product.find({ deleted: true }).lean().populate("categories", "-__v")
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

    //[PATCH] /admin/api/trash/product/:id/restore
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

    getFilesList = (req, res) => {
        const path = "http://localhost:3000/images/";

        fs.readdir(path, function (err, files) {
            if (err) {
                // res.status(500).send({
                //     message: 'File not found',
                // });
                console.error(err);
            }

            let filesList = [];

            files.forEach((file) => {
                filesList.push({
                    name: file,
                    url: URL + file,
                });
            });

            res.status(200).send(filesList);
        });
    }
}

module.exports = new AdminController;