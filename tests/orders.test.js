const request = require('supertest');
const app = require('../app');
const dbHandler = require('./mock-db-handler/mock-db-handler');
const expect = require('chai').expect;
const Product = require('../src/models/product');
const Order = require('../src/models/order');

describe('Test route: /api/orders', ()=> {
    before(async () => {
        await dbHandler.connect();
    });
    afterEach(async () => {
        await dbHandler.clearDatabase()
    });
    after(async () => await dbHandler.closeDatabase());

    it('Order should be added', async ()=> {
        let product = new Product({
            name:'product',
            amount:30,
            count:1,
            fullPrise:1000,
        });
        await product.save();
        let object = await dbHandler.generateMockUser('User');
        return request(app)
            .post('/api/orders/')
            .set('Accept', 'application/json')
            .set('Authorization', object.token)
            .send({
                products:[
                    product._id,
                    product._id
                ],
                deliveryType:'CDEK',
                paymentType:'Наложенный платёж',
                address:'Some address'
            })
            .then(res=>{
                expect(res.status).to.equal(200);
                expect(res.body.message).to.equal('Заказ принят к рассмотрению');
            });
    });
    it('Order should be added only by authorized users', async ()=> {
        return request(app)
            .post('/api/orders/')
            .set('Accept', 'application/json')
            .then(res=>{
                expect(res.status).to.equal(401);
            });
    });
    it('Order should be returned', async ()=> {
        let product = new Product({
            name:'product',
            amount:30,
            count:1,
            fullPrise:1000,
        });
        await product.save();
        let object = await dbHandler.generateMockUser('User');
        let order = new Order({
            user:object.user._id,
            products:[
                product._id,
                product._id
            ],
            deliveryType:'CDEK',
            paymentType:'Наложенный платёж',
            address:'Some address',
            totalPrise:2000
        });
        await order.save();
        return request(app)
            .get(`/api/orders/${order._id}`)
            .set('Accept', 'application/json')
            .set('Authorization', object.token)
            .then(res=>{
                expect(res.status).to.equal(200);
            });
    });
    it('Order should be available to the user who added it', async ()=> {
        let product = new Product({
            name:'product',
            amount:30,
            count:1,
            fullPrise:1000,
        });
        await product.save();
        let object = await dbHandler.generateMockUser('User');
        let order = new Order({
            user:object.user._id,
            products:[
                product._id,
                product._id
            ],
            deliveryType:'CDEK',
            paymentType:'Наложенный платёж',
            address:'Some address',
            totalPrise:2000
        });
        await order.save();
        let object2 = await dbHandler.generateMockUser('User', 'ssss@mail.ru');
        return request(app)
            .get(`/api/orders/${order._id}`)
            .set('Accept', 'application/json')
            .set('Authorization', object2.token)
            .then(res=>{
                expect(res.status).to.equal(403);
            });
    });
});