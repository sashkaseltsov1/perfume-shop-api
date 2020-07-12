const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mockedDb = new MongoMemoryServer();
module.exports.generateMockUser = async (role)=>{
    const User = require('../../src/models/user');
    let admin = new User({
        name:'sasa',
        lastname:'sasa',
        email:'sasa@mail.ru',
        password:'123456',
        role:role
    });
    await admin.save();
    let token = require('../../src/controllers/utils/auth-utils/generate-tokens').generateAccessToken(admin);
    return {admin, token}
};
module.exports.connect = async () => {
    const uri = await mockedDb.getUri();

    const mongooseOpts = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex : true
    };
    await mongoose.connect(uri, mongooseOpts);
};

module.exports.closeDatabase = async () => {
    await mongoose.disconnect();
    await mockedDb.stop();
};

module.exports.clearDatabase = async () => {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
};