const express = require('express');
const router = express.Router();

const { verifySignUp } = require("../middleware");
const siteController = require("../controllers/SiteController");
const orderController = require("../controllers/OrderController");

router.post('/signup', [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted], siteController.signup);

router.post('/signin', siteController.signin);

router.post('/signout', siteController.signOut);

router.get('/all-products', siteController.getAllProducts);

router.get('/product/:slug', siteController.getProductBySlug);

router.get('/all-categories', siteController.getAllCategories);

router.get("/category/:id/product", siteController.getProductFilteredByCategory);

// router.product("/add-to-cart", siteController.addToCart);

// router.get("/cart", siteController.getCart);

router.post('/create-order', orderController.placeOrder);

// router.product('/order-list', orderController.getOrderList);

module.exports = router;