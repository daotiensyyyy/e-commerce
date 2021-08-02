const memberRouter = require('./member');
const sellerRouter = require('./seller');
const adminRouter = require('./admin');
const siteRouter = require('./site');

function route(app) {
    app.use('/member', memberRouter);
    app.use('/seller', sellerRouter);
    app.use('/admin', adminRouter);
    app.use('/', siteRouter);
}
module.exports = route;