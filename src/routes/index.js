const productRoutes = require('./product_routes');
module.exports = function (app) {
    productRoutes(app);
};