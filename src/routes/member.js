const express = require('express');
const router = express.Router();

const { authJwt } = require("../middleware");
const memberController = require("../controllers/MemberController");

const orderController = require("../controllers/OrderController");

router.get("/api/all-products", [authJwt.verifyToken, authJwt.isMember], memberController.getAllProducts);

router.get("/api/product/:id", [authJwt.verifyToken, authJwt.isMember], memberController.getProductById);

router.get("/api/category/:id/product", [authJwt.verifyToken, authJwt.isMember], memberController.getProductFilteredByCategory);

router.post("/api/add-to-cart", [authJwt.verifyToken, authJwt.isMember], memberController.addToCart);

router.get("/api/:id/cart", [authJwt.verifyToken, authJwt.isMember], memberController.getCart);

router.post('/api/create-order', [authJwt.verifyToken, authJwt.isMember], orderController.placeOrder);

router.get('/api/:uid/order-list', [authJwt.verifyToken, authJwt.isMember], orderController.getOrderList);

module.exports = router;