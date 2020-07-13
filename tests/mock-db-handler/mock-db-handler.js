const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcryptjs');

const mockedDb = new MongoMemoryServer();
module.exports.generateMockUser = async (role, email='sasa@mail.ru')=>{
    const User = require('../../src/models/user');
    let salt = bcrypt.genSaltSync(10);
    let user = new User({
        name:'sasa',
        lastname:'sasa',
        email:email,
        password:bcrypt.hashSync('123456', salt),
        role:role
    });
    let token = require('../../src/controllers/utils/auth-utils/generate-tokens').generateAccessToken(user);
    user.refreshToken=require('../../src/controllers/utils/auth-utils/generate-tokens').generateRefreshToken(user);
    await user.save();
    return {user, token}
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