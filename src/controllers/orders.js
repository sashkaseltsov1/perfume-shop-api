const Order = require('../models/order');
const User = require('../models/user');
const Product = require('../models/product');
const errorHandler = require('./utils/error-handler');

module.exports.addOrder = async (req, res)=>{
    if(!req.user) return errorHandler(res, 400,null,'Invalid user type');
    if(!req.body.products) return errorHandler(res, 400,null,'Invalid array of products');
    let user;
    let orderPrise;
    let productIdArray;
    try{
        user =await User.findById(req.user._id);
        if(!user) return errorHandler(res, 404,null, 'User not found');
    }catch (e) {
        return errorHandler(res, 400,e);
    }
    try{
        productIdArray = req.body.products.map(id=>(id));
        let productPrises = await Product.find({'_id':{ $in: productIdArray}}, 'fullPrise -_id');
        productPrises = productPrises.map(item=>item.fullPrise);
        console.log(productPrises)
        orderPrise = productPrises.reduce((sum, value)=>(sum+value));
    }catch (e) {
        return errorHandler(res, 400,e);
    }
    let order = new Order({
        user:user._id,
        products:productIdArray,
        totalPrise:orderPrise,
        address:req.body.address,
        history:[{state:'Принят на рассмотрение', date:Date.now()}]
    });
    try{
        await order.save();
        user.orders.push(order);
        await user.save();
        res.status(200).json({message: 'Заказ принят к рассмотрению'});
    } catch (e) {
        return errorHandler(res, 400,e);
    }
};

