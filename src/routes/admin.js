const express = require('express');
const router = express.Router();

const { authJwt } = require("../middleware");
const adminController = require("../controllers/AdminController");

router.delete('/api/user/:id/delete', [authJwt.verifyToken, authJwt.isAdmin], adminController.delete);

router.put('/api/user/:id/edit', [authJwt.verifyToken, authJwt.isAdmin], adminController.editUserById);

router.get('/api/user/:id', [authJwt.verifyToken, authJwt.isAdmin], adminController.getUserInfoById);

router.get('/api/all-users', [authJwt.verifyToken, authJwt.isAdmin], adminController.getAllUsers);

router.get('/api/all-products', [authJwt.verifyToken, authJwt.isAdmin], adminController.getAllProducts);

router.get('/api/product/:id', [authJwt.verifyToken, authJwt.isAdmin], adminController.getProductById);

router.post('/api/create-product', [authJwt.verifyToken, authJwt.isAdmin], adminController.createProduct);

router.put('/api/product/:id/edit', [authJwt.verifyToken, authJwt.isAdmin], adminController.editProductById);

router.delete('/api/product/:id/delete', [authJwt.verifyToken, authJwt.isAdmin], adminController.deleteProductById);

router.get('/api/trash/products', [authJwt.verifyToken, authJwt.isAdmin], adminController.getProductsDeleted);

router.patch('/api/trash/product/:id/restore', [authJwt.verifyToken, authJwt.isAdmin], adminController.restoreProductById);

// router.post('/api/create-category', [authJwt.verifyToken, authJwt.isAdmin], adminController.createCategory);

router.post("/upload-file", adminController.uploadFile);

router.get("/files", adminController.getFilesList)

module.exports = router;