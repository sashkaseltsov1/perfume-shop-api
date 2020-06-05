const path = require('path');
const fs = require('fs');
const Product = require('../models/product');
const TransformToCondition = require('./utils/products-utils/transformQueryToCondition');
const getPage = require('./utils/products-utils/get-page');
const errorHandler = require('../controllers/utils/error-handler');



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

module.exports.getProduct = async (req, res)=>{
    console.log(req.query.count)
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
            let min = 0>product.comments.length-count-12?
                0:product.comments.length-count-12;
            product.comments = product.comments.
            slice(min,product.comments.length-count).
            reverse();
            console.log(product.comments)
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
    if(!req.file) return res.status(415).json({message: 'Формат не определен!'});

    const tempPath = req.file.path;
    const targetPath = './images/'+ req.file.filename+'.jpg';

    if (path.extname(req.file.originalname).toLowerCase() !== ".jpg"){
        fs.unlink(tempPath, (err)=>{
            if (err) throw err;
            console.log('file successfully deleted')});
        return res.status(415).json({message: 'Данный формат файла не поддерживается!'});
    }

    fs.rename(tempPath, targetPath, (err)=>{
        if (err) return res.status(500).json({message:err.message? err.message:err});
        console.log('file successfully renamed')
    });

    let product = new Product(req.body);
    product.image='http://176.197.36.4:8000/'+req.file.filename+'.jpg';

    try {
        await product.save()
    } catch (e) {
        fs.unlink(targetPath, (err)=>{
            if(err) throw err;
            console.log('file successfully deleted')
        });
        return res.status(409).json({message:e.message?e.message:e});
    }
    res.status(201).json({message: 'Продукт успешно добавлен!'});
};