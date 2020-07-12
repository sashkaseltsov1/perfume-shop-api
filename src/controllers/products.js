const path = require('path');
const fs = require('fs');
const Product = require('../models/product');
const TransformToCondition = require('./utils/products-utils/transformQueryToCondition');
const getPage = require('./utils/products-utils/get-page');
const errorHandler = require('../controllers/utils/error-handler');

module.exports.removeOrRestoreComment = async (req, res)=>{
    if(req.user.role!=='Admin'){
        errorHandler(res, 403,null,'Only admin can use this route!');
        return;
    }
    let productId = req.params.id;
    let commentId = req.body.commentId;
    try {
        let product =await Product.findById(productId);
        if(product){
            product.comments = product.comments.map(comment=>{
                if(comment._id.equals(commentId)) comment.isRemoved=req.body.isRemoved;
                return comment;
            });
            try {
                await product.save();
                res.status(200).json({commentId:commentId, isRemoved:req.body.isRemoved})
            } catch (e) {
                errorHandler(res, 500,e);
            }
        }else{
            errorHandler(res, 404,null,'Product not found');
        }
    }catch (e) {
        errorHandler(res, 500,e);
    }
};
module.exports.addComment = async (req, res)=>{
    if(!req.body.stars ){
        errorHandler(res, 400,null,'Пожалуйста, оцените этот товар');
        return;
    }
    let productId = req.params.id;
    try {
        let product =await Product.findById(productId);
        if(product){
            let ratesCount = product.comments.length;
            let overallRating = product.stars;
            let newRating = parseInt(req.body.stars);
            let rating = ((overallRating * ratesCount) + newRating) / (ratesCount + 1);
            rating=rating.toFixed(1);
            product.stars=rating;
            product.comments.push({...req.body});
            product.commentsCount = product.comments.length;
            try {
                await product.save();
                res.status(200).json({comment:product.comments.pop()});
            }catch (e) {
                errorHandler(res, 500,e);
            }
        }else{
            errorHandler(res, 404,null,'Product not found');
        }
    }catch (e) {
        errorHandler(res, 500,e);
    }
};
module.exports.removeProduct = async (req, res)=>{
    if(req.user.role!=='Admin'){
        errorHandler(res, 403,null,'Only admin can use this route!');
        return;
    }
    let productId = req.params.id;
    try {
        await Product.deleteOne({ _id:productId });
        res.status(200).json({message:'Product was removed!'});
    }catch (e) {
        errorHandler(res, 500,e);
    }
};
module.exports.getProduct = async (req, res)=>{
    let productId = req.params.id;
    let count = req.query.count? parseInt(req.query.count):0;
    if(!Number.isInteger(count)){
        errorHandler(res, 400,null, 'Invalid type of count');
        return;
    }
    let product;
    try {
        product =await Product.findById(productId).
        populate('perfumeType').
        populate('brand').
        populate('fragrance').
        populate('gender');
        if(product){
            product.comments = product.comments.filter(comment=>comment.isRemoved===false);
            product.commentsCount=product.comments.length;
            let min = 0>product.comments.length-count-12?
                0:product.comments.length-count-12;
            product.comments = product.comments.
            slice(min,product.comments.length-count).
            reverse();
            res.status(200).json({product});
        }else{
            errorHandler(res, 404,null, 'Product not found');
        }
    }catch (e) {
        errorHandler(res, 500,e);
    }
};
module.exports.getAll = (req, res)=>{
    let result;
    try {
        result = TransformToCondition(req.query);
    }
    catch (e) {
        return res.status(400).json({message:e.message?e.message:e})
    }
    let sortObj = {};
    if(req.query.sort==='inc') sortObj = {fullPrise:1};
    if(req.query.sort==='dec') sortObj = {fullPrise:-1};
    Product.find(result).sort(sortObj).select('name fullPrise perfumeType isDiscount isNovelty image').
    populate('perfumeType').
    exec((err, products)=> {
        if(err) return res.status(500).json({
            products:[],
            count:0,
            error:err
        });
        let page = getPage(req.query, products, err);
        res.status(200).json(page);
    });
};

module.exports.create = async (req, res)=>{
    if(req.user.role!=='Admin'){
        errorHandler(res, 403,null,'Only admin can use this route!');
        return;
    }
    let tempPath;
    let targetPath;
    if(req.file) {
        tempPath = req.file.path;
        targetPath = './images/'+ req.file.filename+'.jpg';
        if (path.extname(req.file.originalname).toLowerCase() !== ".jpg"){
            try {
                fs.unlinkSync(tempPath);
            } catch (e) {
                errorHandler(res, 500,e);
                return;
            }
            errorHandler(res, 415,null,'Invalid image type!');
            return;
        }
        try {
            fs.renameSync(tempPath, targetPath);
        } catch (e) {
            errorHandler(res, 500,e);
            return;
        }
    }
    let product = new Product(req.body);
    if(req.file){
        product.image=req.file.filename+'.jpg';
    }
    try {
        await product.save()
    } catch (err) {
        try {
            targetPath && fs.unlinkSync(targetPath);
        }catch (e) {
            errorHandler(res, 500,e);
            return;
        }
        errorHandler(res, 409,err);
        return;
    }
    res.status(201).json({message: 'Product added'});
};
module.exports.update = async (req, res)=>{
    if(req.user.role!=='Admin'){
        errorHandler(res, 403,null,'Only admin can use this route!');
        return;
    }
    let product;
    try {
        product =await Product.findById(req.params.id)
    }catch (e) {
        errorHandler(res, 500,e);
        return;
    }
    if(!product){
        errorHandler(res, 404,null,'Product not found!');
        return;
    }
    const tempPath = req.file && req.file.path;
    const targetPath = req.file && './images/'+ req.file.filename+'.jpg';
    let oltImage = product.image;
    if(req.file) {
        if (path.extname(req.file.originalname).toLowerCase() !== ".jpg"){
            try {
                fs.unlinkSync(tempPath);
            }catch (e) {
                errorHandler(res, 500,e);
                return;
            }
            errorHandler(res, 415,null, 'Invalid image type!');
            return;
        }
        try {
            fs.renameSync(tempPath, targetPath);
        }catch (e) {
            errorHandler(res, 500, e);
            return;
        }
        product.image=req.file.filename+'.jpg';
    }
    product.name=req.body.name;
    product.description=req.body.description;
    product.amount=req.body.amount;
    product.count=req.body.count;
    product.isDiscount=req.body.isDiscount;
    product.isNovelty=req.body.isNovelty;
    product.fullPrise=req.body.fullPrise;
    product.perfumeType=req.body.perfumeType;
    product.brand=req.body.brand;
    product.gender=req.body.gender;
    product.fragrance=req.body.fragrance;
    try {
        await product.save()
    } catch (err) {
        try {
            fs.unlinkSync(targetPath);
        }catch (e) {
            errorHandler(res, 500,e);
            return;
        }
        errorHandler(res, 409,err);
        return;
    }
    if(req.file){
        try {
            fs.unlinkSync('./images/'+oltImage);
        }catch (e) {}
    }
    res.status(200).json({message: 'Продукт успешно обновлен!'});
};