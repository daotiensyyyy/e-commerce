const db = require("../models");
const Product = db.product;
const Category = db.category;

class SellerController {

    //[GET] /seller/api/all-products
    getAll = (req, res) => {
        Product.find({ deleted: false }).lean().populate("categories", "-__v")
            .then(data => {
                res.json(data);
            })
            .catch((err) => {
                res.status(500).send({ message: err.message });
            });
    }

    //[GET] /seller/api/product/:id
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

    //[POST] /seller/api/create-product
    create = (req, res, next) => {
        const product = new Product({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
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
                    product.save(err => {
                        if (err) {
                            res.status(500).send({ message: err });
                            return;
                        }
                        res.json({ message: "Product was created successfully!" });
                    });
                }
                );
            }
            else {
                res.send({ message: "Require category!" });
            }
        });
    }

    //[PUT] /seller/api/product/:id/edit
    editProductById = (req, res) => {
        Product.findByIdAndUpdate({ _id: req.params.id, deleted: false }, req.body)
            .then(product => {
                if (!product) {
                    return res.status(404).send({ message: 'Product not found!' });
                }
                res.status(200).send({ message: 'Product is updated' });
            })
            .catch(err => {
                if (err.kind == 'ObjectId') {
                    return res.status(404).send({ message: 'Product not found' })
                }
                return res.status(500).send({ message: 'Error' });
            })
    }

    //[DELETE] /seller/api/product/:id/delete
    deleteProductById = (req, res) => {
        Product.delete({ _id: req.params.id })
            .then(() => {
                return res.status(200).send({ message: 'Product is deleted' });
            })
            .catch(err => {
                if (err.kind == 'ObjectId') {
                    return res.status(500).send({ message: 'Product not found' });
                }
                return res.status(500).send({ message: 'Error' });
            });
    }

    //[GET] /seller/api/trash/products
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

    //[PATCH] /seller/api/trash/product/:id/restore
    restoreProductById = (req, res) => {
        Product.restore({ _id: req.params.id })
            .then(() => {
                return res.status(200).send({ message: 'Product was successfully restored!' });
            })
            .catch(err => {
                if (err.kind == 'ObjectId') {
                    return res.status(404).send({ message: 'Product not found' })
                }
                return res.status(500).send({ message: err.message });
            });
    }

    //[POST] /seller/api/create-category
    createCategory = (req, res) => {
        const category = new Category(req.body);
        category.save()
            .then(data => {
                res.json(data);
            }).catch(err => {
                res.status(500).json({
                    message: err.message || "Some error occurred while creating the Note."
                });
            });
    }

}

module.exports = new SellerController;