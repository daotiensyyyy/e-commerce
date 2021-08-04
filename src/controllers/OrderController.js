const db = require("../models");
const Order = db.order;

class OrderController {

    //[POST] /api/create-order
    placeOrder = (req, res, next) => {
        // console.log(req.body);
        // res.json(req.body);
        if (!(Array.isArray(req.body.items) && req.body.items.length)) {
            res.send('No order items included');
        }
        const orderData = {
            code: req.body.code,
            customerName: req.body.customerName,
            customerEmail: req.body.customerEmail,
            customerAddress: req.body.customerAddress,
            customerPhone: req.body.customerPhone,
            // billingAddress: req.body.billingAddress,
            shippingMethod: req.body.shippingMethod,
            paymentMethod: req.body.paymentMethod
        };
        orderData.items = req.body.items.map(item => {
            return {
                productId: item.productId,
                name: item.name,
                price: item.price,
                qty: item.qty
            };
        });
        orderData.grandTotal = req.body.items.reduce((total, item) => {
            return total + item.price * item.qty;
        }, 0);
        // console.log(orderData);
        const order = new Order(orderData);

        order.save()
            .then(savedOrder => {
                // const allProductPromises = savedOrder.items.map(item => {
                //     return Product.get(item.productId).then(product => {
                //       product.quantity = product.quantity - item.qty;
                //       return product.save();
                //     });
                //   });
                //   Promise.all(allProductPromises)
                //     .then(data => {
                //       return Cart.get(savedOrder.user);
                //     })
                //     .then(cart => {
                //       cart.items = [];
                //       return cart.save();
                //     })
                //     .then(data => {
                //       res.json(savedOrder);
                //     })
                //     .catch(err => {
                //       // console.log(err);
                //       const error = new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true);
                //       return next(error);
                //     });

                res.status(200).json(savedOrder);
            })
            .catch(err => {
                // console.log(err);
                return res.status(500).send(err.message);
            });
    }

    //[POST] /api/order-list
    getOrderList = (req, res) => {
        Order.findOne({ code: req.body.code }).lean()
            .then((order) => {
                if (!order) {
                    return res.status(404).send('Empty');
                }
                res.status(200).json(order);
            })
            .catch(err => {
                if (err.kind == 'ObjectId') {
                    return res.status(404).send('Not found');
                }
                return res.status(500).send(err.message);
            });
    }

}

module.exports = new OrderController;