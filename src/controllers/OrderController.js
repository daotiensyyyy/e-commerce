const db = require("../models");
const Order = db.order;
const nodemailer = require("nodemailer");
require('dotenv').config();

class OrderController {

    //[POST] /api/create-order
    placeOrder = (req, res, next) => {
        if (!(Array.isArray(req.body.items) && req.body.items.length)) {
            res.send('No order items included');
        }
        const orderData = {
            // code: _id,
            customerName: req.body.customerName,
            customerAddress: req.body.customerAddress,
            customerPhone: req.body.customerPhone,
            paymentMethod: req.body.paymentMethod
        };
        orderData.items = req.body.items.map(item => {
            return {
                productId: item.productId,
                name: item.product.name,
                price: item.price,
                qty: item.qty,
                ice: item.ice,
                sugar: item.sugar,
                toppings: item.toppings,
            };
        });
        orderData.grandTotal = req.body.items.reduce((total, item) => {
            return total + item.price * item.qty;
        }, 0);
        // console.log(orderData);
        const order = new Order(orderData);

        order.save()
            .then(savedOrder => {

                let transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: false,
                    auth: {
                        user: process.env.GMAIL_USER,
                        pass: process.env.GMAIL_PASSWORD,
                    },
                    tls: {
                        rejectUnauthorized: false,
                    }
                });

                let mailInfo = {
                    from: "sydao1579@gmail.com", // sender address
                    to: "sydao1579@gmail.com", // list of receivers
                    subject: "ĐƠN HÀNG MỚI", // Subject line
                    // text: savedOrder.customerAddress, // plain text body
                    html:
                        `
                        <div>Tên khách hàng: ${savedOrder.customerName}</div>
                        <div>Địa chỉ: ${savedOrder.customerAddress}</div>
                        <div>Số điện thoại: ${savedOrder.customerPhone}</div>
                        <div>
                            Đơn hàng: <br>
                            ${savedOrder.items.map(item => (
                            `
                                    <div>- Tên mặt hàng: ${item.name}</div>
                                    <div>- Toppings thêm: ${item.toppings}</div>
                                    <div>- Đá: ${item.ice}</div>
                                    <div>- Đường: ${item.sugar}</div>
                                    <div>- Giá: ${item.price}000đ - Số lượng: ${item.qty} = ${item.price * item.qty}000đ </div>
                                    <hr/>
                                `
                        ))}
                        </div>
                        <div>Phương thức thanh toán: ${savedOrder.paymentMethod}</div>
                        <div>Tổng tiền thanh toán: ${savedOrder.grandTotal}000đ </div>
                    `,
                }

                transporter.sendMail(mailInfo, function (err, success) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Email sent successfully");
                        res.status(200).json(savedOrder);
                    }
                });
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