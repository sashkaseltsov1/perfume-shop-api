const request = require('supertest');
const app = require('../app');
const dbHandler = require('./mock-db-handler/mock-db-handler');
const expect = require('chai').expect;
const Product = require('../src/models/product');
const Gender = require('../src/models/gender');

describe('Test route: /api/products', ()=> {
    before(async () => {
        await dbHandler.connect();
    });
    afterEach(async () => {
        await dbHandler.clearDatabase()
    });
    after(async () => await dbHandler.closeDatabase());

    it('Only new products should be returned', async ()=> {
        let products = [];
        for(let i=0;i<10;i++){
            products.push(new Product({
                name:`product${i}`,
                amount:30,
                count:1,
                isNovelty:i%2===0,
                fullPrise:10000
            }))
        }
        await Product.create(products);
        return request(app)
            .get('/api/products?isNovelty=true')
            .set('Accept', 'application/json')
            .then(res=>{
                expect(res.body.products.length).to.equal(5);
            });
    });
    it('Should get products which prise more then 5000 and less then 9000', async ()=> {
        let products = [];
        for(let i=0;i<10;i++){
            products.push(new Product({
                name:`product${i}`,
                amount:300,
                count:12,
                fullPrise:1000*i
            }))
        }
        await Product.create(products);
        return request(app)
            .get('/api/products?max=8999&min=5001')
            .set('Accept', 'application/json')
            .then(res=>{
                expect(res.body.products.length).to.equal(3);
            });
    });
    it('Should get products for women or men which prise more then 5000', async ()=> {
        let women = new Gender({type:'For women'});
        let men = new Gender({type:'For men'});
        await Gender.create(women,men);
        let products = [];
        for(let i=0;i<10;i++){
            products.push(new Product({
                name:`product${i}`,
                amount:30,
                count:1,
                fullPrise:1000*i,
            }))
        }
        products[0].gender=women._id;
        products[7].gender=women._id;
        products[8].gender=men._id;
        await Product.create(products);
        return request(app)
            .get(`/api/products?min=5001&gender=${women._id}|${men._id}`)
            .set('Accept', 'application/json')
            .then(res=>{
                expect(res.body.products.length).to.equal(2);
            });
    });
    it('Should be returned second page of products which contains only one item', async ()=> {
        let products = [];
        for(let i=0;i<25;i++){
            products.push(new Product({
                name:`product${i}`,
                amount:30,
                count:1,
                fullPrise:1000,
            }))
        }
        await Product.create(products);
        return request(app)
            .get(`/api/products?page=2`)
            .set('Accept', 'application/json')
            .then(res=>{
                expect(res.body.products.length).to.equal(1);
            });
    });
    it('Product should be returned', async ()=> {
        let product = new Product({
            name:'product',
            amount:30,
            count:1,
            fullPrise:1000,
        });
        await product.save();
        return request(app)
            .get(`/api/products/${product._id}`)
            .set('Accept', 'application/json')
            .then(res=>{
                expect(res.body.product.name).to.equal('product')
            })
    });
    it('Product should be removed', async ()=> {
        let product = new Product({
            name:'product',
            amount:30,
            count:1,
            fullPrise:1000,
        });
        await product.save();
        let object = await dbHandler.generateMockUser('Admin');
        return request(app)
            .delete(`/api/products/${product._id}`)
            .set('Accept', 'application/json')
            .set('Authorization', object.token)
            .then(res=>{
                expect(res.body.message).to.equal('Product was removed!')
            })
    });
    it('Product should be removed only by admin', async ()=> {
        let object = await dbHandler.generateMockUser('User');
        return request(app)
            .delete(`/api/products/some_product_id`)
            .set('Accept', 'application/json')
            .set('Authorization', object.token)
            .then(res=>{
                expect(res.status).to.equal(403)
            })
    });
    it('Product should be updated', async ()=> {
        let product = new Product({
            name:'product',
            amount:30,
            count:1,
            fullPrise:1000,
        });
        await product.save();
        let object = await dbHandler.generateMockUser('Admin');
        return request(app)
            .put(`/api/products/${product._id}`)
            .set('Accept', 'multipart/form-data')
            .set('Authorization', object.token)
            .send({
                name:'product',
                amount:30,
                count:1,
                fullPrise:1000,
                description:'New description!!!'
            })
            .then(res=>{
                expect(res.body.message).to.equal('Продукт успешно обновлен!')
            })
    });
    it('Product should be updated only by admin', async ()=> {
        let object = await dbHandler.generateMockUser('User');
        return request(app)
            .put(`/api/products/some_product_id`)
            .set('Accept', 'multipart/form-data')
            .set('Authorization', object.token)
            .then(res=>{
                expect(res.status).to.equal(403)
            })
    });
    it('Product should be created', async ()=> {
        let object = await dbHandler.generateMockUser('Admin');
        return request(app)
            .post(`/api/products/`)
            .set('Accept', 'multipart/form-data')
            .set('Authorization', object.token)
            .send({
                name:'product',
                amount:30,
                count:1,
                fullPrise:1000,
            })
            .then(res=>{
                expect(res.body.message).to.equal('Product added')
            })
    });
    it('Product should be created only by admin', async ()=> {
        let object = await dbHandler.generateMockUser('User');
        return request(app)
            .post(`/api/products/`)
            .set('Accept', 'multipart/form-data')
            .set('Authorization', object.token)
            .send({
                name:'product',
                amount:30,
                count:1,
                fullPrise:1000,
            })
            .then(res=>{
                expect(res.status).to.equal(403)
            })
    });
});