const Product = require('../schemas/product');
const Brand = require('../schemas/brand');
const multer = require('multer');
const upload = multer({ dest: './uploads' });
const path = require('path');
const fs = require('fs');
module.exports = function (app) {


    app.get('/products/:id?/:gender?', (req, res)=>{
        console.log(req.params)
        console.log(req.query)
        Product.find().populate('fragrance').
                        populate('brand').
                        populate('gender').
                        populate('perfumeType').
                        exec((err, product)=> {
            if(err) return res.send(err);
            res.send(product)
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

                    let product = new Product({name:req.body.name,
                        brand:req.body.brand,
                        fragrance:req.body.fragrance,
                        gender: req.body.gender,
                        perfumeType:req.body.perfumeType,
                        image:req.file.filename+'.jpg'});

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