const express = require('express');
const router = express.Router();

const { authJwt } = require("../middleware");
const sellerController = require('../controllers/SellerController');

router.get('/api/all-products', [authJwt.verifyToken, authJwt.isSeller], sellerController.getAll);

router.get('/api/product/:id', [authJwt.verifyToken, authJwt.isSeller], sellerController.getProductById);

router.post('/api/create-product', [authJwt.verifyToken, authJwt.isSeller], sellerController.create);

router.put('/api/product/:id/edit', [authJwt.verifyToken, authJwt.isSeller], sellerController.editProductById);

router.delete('/api/product/:id/delete', [authJwt.verifyToken, authJwt.isSeller], sellerController.deleteProductById);

router.get('/api/trash/products', [authJwt.verifyToken, authJwt.isSeller], sellerController.getProductsDeleted);

router.patch('/api/trash/product/:id/restore', [authJwt.verifyToken, authJwt.isSeller], sellerController.restoreProductById);

router.post('/api/create-category', [authJwt.verifyToken, authJwt.isSeller], sellerController.createCategory);

module.exports = router;