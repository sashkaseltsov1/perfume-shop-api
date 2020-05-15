const Product = require('../schemas/product');
const multer = require('multer');
const upload = multer({ dest: './uploads' });
const path = require('path');
const fs = require('fs');

module.exports =  (app)=> {

    const parseQueryToObj = (queries) => {
        const filters = {
            gender: queries.gender,
            brand: queries.brand,
            fragrance: queries.fragrance,
            perfumeType: queries.perfumeType,
            isDiscount:queries.isDiscount,
            new:queries.new
        };
        const toObject = (query, key) => {
            if (query !== undefined)
                return {$or: query.split('|').map(prm => ({[key]: prm}))};
            else
                return undefined;
        };
        const arr = [];
        for (let k in filters) {
            let obj = toObject(filters[k], k);
            if (obj !== undefined) arr.push(obj);
        }

        if(queries.min!==undefined)
            arr.push({fullPrise:{ $gt: queries.min }});
        if(queries.max!==undefined)
            arr.push({fullPrise:{ $lt: queries.max }});

        if (arr.length !== 0)
            return {$and: arr};
        else
            return {}
    };

    const getPage = (query, arr, err)=>{
        let portion = query.portion;
        portion = portion===undefined? 12: Number(portion);
        portion = (typeof portion !=="number" || portion<12 || !Number.isInteger(portion))? 12: portion;
        portion = portion>30? 30:portion;
        portion = portion>arr.length? arr.length: portion;

        let pageCount = arr.length===0? 1:Math.ceil(arr.length/portion);

        let page = query.page;
        page = (page===undefined)? 1: Number(page);
        page = (page===undefined || typeof page !=="number" || page<1 || !Number.isInteger(page))? 1: page;
        page = page>pageCount?pageCount:page;

        let end = page*portion>arr.length? arr.length:page*portion;
        let begin = page*portion-portion;

        return {
            products:arr.slice(begin, end),
            count:arr.length,
            page:page,
            pageCount:pageCount,
            error:err,
            queries:query
        };
    };

    app.get('/products', (req, res)=>{
        console.log('get2')
        let result = parseQueryToObj(req.query);

        let sortObj = {};
        if(req.query.sort==='inc') sortObj = {fullPrise:1};
        if(req.query.sort==='dec') sortObj = {fullPrise:-1};

        Product.find(result).sort(sortObj).select('name fullPrise perfumeType isDiscount new image').
                        populate('perfumeType').
                        exec((err, products)=> {
            if(err) return res.send({
                products:null,
                count:0,
                error:err
            });

            let page = getPage(req.query, products, err);
            console.log(page)
            res.send(page);

        });
    });
    app.post('/products',upload.single('image'), (req, res)=>{
        if(req.file!==undefined)
        {
            const tempPath = req.file.path;
            const targetPath = './images/'+ req.file.filename+'.jpg';
            if (path.extname(req.file.originalname).toLowerCase() === ".jpg") {
                fs.rename(tempPath, targetPath, err => {
                    if (err) return res.send(err);
                    let product = new Product(req.body);
                    product.image='http://176.197.36.4:8000/'+req.file.filename+'.jpg';

                    product.save((err)=> {
                        if (err) {
                            fs.unlink(targetPath, err => {
                                if (err) return res.send(err);
                            });
                            return res.send(err);
                        }

                        res.status(200).contentType("text/plain").end("Product added!");
                    });
                });
            } else {
                fs.unlink(tempPath, err => {
                    if (err) return res.send(err);
                    res.status(403).contentType("text/plain").end("Only .jpg files are allowed!");
                });
            }
        }else{
            res.status(403).contentType("text/plain").end("Only .jpg files are allowed!");
        }
    })
};