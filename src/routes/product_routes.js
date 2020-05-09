const Product = require('../schemas/product');
module.exports = function (app) {
    app.get('/products', (req, res)=>{

        Product.find().populate('fragrance'). exec(function (err, person) {
            res.send(person)
        });
        /*Product.find({}, (err, kittens)=> {
            if (err) return console.error(err);
            res.send(kittens)
        })*/

    });
    app.post('/products', (req, res)=>{
        /*res.send(req.body);*/
        let reqBody = req.body;
        let product = new Product({name:reqBody.name,
                                    brand:reqBody.brand,
                                    fragrance:reqBody.fragrance,
                                    gender: reqBody.gender,
                                    perfumeType:reqBody.perfumeType,
                                    image:reqBody.image});
        product.save((err)=> {
            if (err) res.send(err); else
            res.send('Product successfully saved.');
        });

    })
};