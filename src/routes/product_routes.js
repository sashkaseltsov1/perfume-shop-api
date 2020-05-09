const Product = require('../schemas/product');

module.exports = function (app) {
    app.get('/products', (req, res)=>{
        Product.find({cost:989}, (err, kittens)=> {
            if (err) return console.error(err);
            res.send(kittens)
        })

    });
    app.post('/products', (req, res)=>{
        let product = new Product({title:req.body.title, genderType: req.body.genderType, cost:req.body.cost});
        product.save((err)=> {
            if (err) throw err;
            res.send('Product successfully saved.');
        });

    })
};