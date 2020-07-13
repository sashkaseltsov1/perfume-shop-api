const request = require('supertest');
const app = require('../app');
const dbHandler = require('./mock-db-handler/mock-db-handler');
const expect = require('chai').expect;

describe('Test route: /api/user', ()=> {
    before(async () => {
        await dbHandler.connect();
    });
    afterEach(async () => {
        await dbHandler.clearDatabase()
    });
    after(async () => await dbHandler.closeDatabase());

    it('User data should be returned', async ()=> {
        let object = await dbHandler.generateMockUser('User');
        return request(app)
            .get('/api/user/')
            .set('Accept', 'application/json')
            .set('Authorization', object.token)
            .then(res=>{
                expect(res.status).to.equal(200);
            });
    });
    it('User data should be updated', async ()=> {
        let object = await dbHandler.generateMockUser('User');
        return request(app)
            .put('/api/user/')
            .set('Accept', 'application/json')
            .set('Authorization', object.token)
            .send({
                name:object.user.name,
                lastname:object.user.lastname,
                phone:'88009993333',
            })
            .then(res=>{
                expect(res.status).to.equal(200);
            });
    });
});