const productRoutes = require('./product-routes');
const filterRoutes = require('./filter-routes');
module.exports = function (app) {
    productRoutes(app);
    filterRoutes(app);
};