const request = require('supertest');
const app = require('../app');
const dbHandler = require('./mock-db-handler/mock-db-handler');
const expect = require('chai').expect;

describe('Test route: /api/auth', ()=> {
    before(async () => {
        await dbHandler.connect();
    });
    afterEach(async () => {
        await dbHandler.clearDatabase()
    });
    after(async () => await dbHandler.closeDatabase());

    it('User should be registered', async ()=> {
        return request(app)
            .post('/api/auth/signup')
            .set('Accept', 'application/json')
            .send({
                name:'sasa',
                lastname:'sasa',
                email:'sasa@mail.ru',
                password:'123456',
            })
            .then(res=>{
                expect(res.status).to.equal(200);
                expect(res.body.message).to.equal('Регистрация прошла успешно');
            });
    });
    it('Should be returned error, because email is already exist', async ()=> {
        await dbHandler.generateMockUser('User');
        return request(app)
            .post('/api/auth/signup')
            .set('Accept', 'application/json')
            .send({
                name:'sasa2',
                lastname:'sasa2',
                email:'sasa@mail.ru',
                password:'1234567',
            })
            .then(res=>{
                expect(res.status).to.equal(500);
            });
    });
    it('User should be logged in', async ()=> {
        await dbHandler.generateMockUser('User');
        return request(app)
            .post('/api/auth/signin')
            .set('Accept', 'application/json')
            .send({
                email:'sasa@mail.ru',
                password:'123456',
            })
            .then(res=>{
                expect(res.status).to.equal(200);
            });
    });
    it('Should be returned new pair of tokens', async ()=> {
        let object = await dbHandler.generateMockUser('User');
        return request(app)
            .put('/api/auth/refresh-token')
            .set('Accept', 'application/json')
            .send({
                refreshToken:object.user.refreshToken
            })
            .then(res=>{
                expect(res.status).to.equal(200);
                expect(res.body.token).to.be.a('string');
                expect(res.body.refreshToken).to.be.a('string');
            });
    });
});