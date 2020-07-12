const request = require('supertest');
const app = require('../app');
const dbHandler = require('./mock-db-handler/mock-db-handler');
const expect = require('chai').expect;
const Brand = require('../src/models/brand');

describe('Test route: /api/filters', ()=> {
    before(async () => {
        await dbHandler.connect();
    });
    afterEach(async () => {
        await dbHandler.clearDatabase()
    });
    after(async () => await dbHandler.closeDatabase());

    it('All filters should be returned', (done)=> {
        request(app)
            .get('/api/filters/')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200,done)
    });
    it('New brand should be added', async ()=> {
        let object = await dbHandler.generateMockUser('Admin');
        return request(app)
            .post('/api/filters/brand')
            .set('Accept', 'application/json')
            .set('Authorization', object.token)
            .send({type:'Name of new brand'})
            .expect('Content-Type', /json/)
            .then(res=>{
                expect(res.body.items[0].type).to.equal('Name of new brand');
                expect(res.body.items.length).to.equal(1)
            })
    });
    it('Access should be denied if non-admin tries to add new filter', async ()=> {
        let object = await dbHandler.generateMockUser('User');
        return request(app)
            .post('/api/filters/brand')
            .set('Accept', 'application/json')
            .set('Authorization', object.token)
            .send({type:'Name of new brand'})
            .expect('Content-Type', /json/)
            .then(res=>{
                expect(res.status).to.equal(403)
            })
    });
    it('Brand should be removed', async ()=> {
        let brand=new Brand({type:'Some brand'});
        await brand.save();
        let object = await dbHandler.generateMockUser('Admin');
        return request(app)
            .delete(`/api/filters/brand/${brand._id}`)
            .set('Accept', 'application/json')
            .set('Authorization', object.token)
            .expect('Content-Type', /json/)
            .then(res=>{
                expect(res.body.items.length).to.equal(0)
            })
    });
    it('Access should be denied if non-admin tries to remove filter', async ()=> {
        let brand=new Brand({type:'Some brand'});
        await brand.save();
        let object = await dbHandler.generateMockUser('User');
        return request(app)
            .delete(`/api/filters/brand/${brand._id}`)
            .set('Accept', 'application/json')
            .set('Authorization', object.token)
            .expect('Content-Type', /json/)
            .then(res=>{
                expect(res.status).to.equal(403)
            })
    });
    it('All brands should be returned', ()=> {
        return request(app)
            .get('/api/filters/brand/')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .then(res=>{
                expect(res.body.category).to.equal('brand')
            })
    });
    it('Filter should be not found', ()=> {
        return request(app)
            .get('/api/filters/other_filter/')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .then(res=>{
                expect(res.status).to.equal(404)
            })
    });
});