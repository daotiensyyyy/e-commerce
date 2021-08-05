const express = require('express');
const router = express.Router();

const { verifySignUp } = require("../middleware");
const siteController = require("../controllers/SiteController");
const orderController = require("../controllers/OrderController");

router.post('/api/signup', [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted], siteController.signup);

router.post('/api/signin', siteController.signin);

router.get('/api/all-products', siteController.getAllProducts);

router.get('/api/product/:id', siteController.getProductById);

router.get('/api/all-categories', siteController.getAllCategories);

router.get("/api/category/:id/product", siteController.getProductFilteredByCategory);

// router.post("/api/add-to-cart", siteController.addToCart);

// router.get("/api/cart", siteController.getCart);

router.post('/api/create-order', orderController.placeOrder);

router.post('/api/order-list', orderController.getOrderList);

module.exports = router;