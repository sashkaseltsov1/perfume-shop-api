const Order = require('../models/order');
const User = require('../models/user');
const Product = require('../models/product');
const errorHandler = require('./utils/error-handler');

module.exports.addOrder = async (req, res)=>{
    if(!req.body.products || req.body.products.length<1) {
        errorHandler(res, 400,null,'Invalid array of products');
        return;
    }
    if(!req.body.address) {
        errorHandler(res, 400,null,'Укажите адрес доставки');
        return;
    }
    if(!req.body.deliveryType) {
        errorHandler(res, 400,null,'Укажите способ доставки');
        return;
    }
    if(!req.body.paymentType) {
        errorHandler(res, 400,null,'Укажите тип платежа');
        return;
    }
    let user;
    let orderPrise;
    let productIdArray;
    try{
        user =await User.findById(req.user._id);
        if(!user) {
            errorHandler(res, 404,null, 'User not found');
            return;
        }
    }catch (e) {
        errorHandler(res, 400,e);
        return;
    }
    try{
        productIdArray = req.body.products;

        let productPrises = await Product.find({'_id':{ $in: productIdArray}}, 'fullPrise _id');

        productPrises = productPrises.map(item=>{
            let count = productIdArray.filter(id=>item._id.equals(id)).length;

            return item.fullPrise*count});

        orderPrise = productPrises.reduce((sum, value)=>(sum+value));
    }catch (e) {
        errorHandler(res, 400,e);
        return;
    }
    let order = new Order({
        user:user._id,
        products:productIdArray,
        totalPrise:orderPrise,
        address:req.body.address,
        deliveryType:req.body.deliveryType,
        paymentType:req.body.paymentType,
        history:[{state:'Оформлен', date:Date.now()},{state:'Принят на рассмотрение', date:Date.now()}]
    });
    try{
        await order.save();
        user.orders.push(order);
        await user.save();
        res.status(200).json({message: 'Заказ принят к рассмотрению', orderId:order._id});
    } catch (e) {
        errorHandler(res, 400,e);
    }
};
module.exports.getOrder = async (req, res)=>{
    let orderId = req.params.id;
    let order;
    try {
        order =await Order.findById(orderId).populate('perfumeType').populate({
            path:'products',
            populate: { path: 'perfumeType' },
            select:'_id isNovelty isDiscount image fullPrise name perfumeType'});
    }catch (e) {
        errorHandler(res, 500,e);
        return;
    }
    if(order){
        if(!order.user._id.equals(req.user._id)){
            errorHandler(res, 403,null, 'Access denied');
            return;
        }
        res.status(200).json({order:order});
    }else{
        errorHandler(res, 404,null, 'Order not found');
    }
};

