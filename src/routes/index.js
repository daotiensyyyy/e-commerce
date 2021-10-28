const adminRouter = require('./admin');
const siteRouter = require('./site');

function route(app) {
    app.use('/api/admin', adminRouter);
    app.use('/api', siteRouter);
}
module.exports = route;