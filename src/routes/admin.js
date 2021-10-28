const express = require('express');
const router = express.Router();

const { authJwt } = require("../middleware");
const adminController = require("../controllers/AdminController");

// router.delete('/user/:id/delete', [authJwt.verifyToken, authJwt.isAdmin], adminController.delete);

// router.put('/user/:id/edit', [authJwt.verifyToken, authJwt.isAdmin], adminController.editUserById);

// router.get('/user/:id', [authJwt.verifyToken, authJwt.isAdmin], adminController.getUserInfoById);

// router.get('/all-users', [authJwt.verifyToken, authJwt.isAdmin], adminController.getAllUsers);

// router.get('/all-products', [authJwt.verifyToken, authJwt.isAdmin], adminController.getAllProducts);
router.get('/all-products', adminController.getAllProducts);

router.get('/product/:id', adminController.getProductById);

router.post('/create-product', adminController.createProduct);

router.post('/create-category', adminController.createCategory);

router.put('/product/:id/edit', adminController.editProductById);

router.delete('/product/:id/delete', adminController.deleteProductById);

router.get('/trash/products', adminController.getProductsDeleted);

router.patch('/trash/product/:id/restore', adminController.restoreProductById);

// router.product('/api/create-category', adminController.createCategory);

// router.product("/upload-file", adminController.uploadFile);

// router.get("/files", adminController.getFilesList)

module.exports = router;