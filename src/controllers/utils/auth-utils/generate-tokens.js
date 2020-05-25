const jwt = require('jsonwebtoken');
const config = require('../../../../config');

const generateAccessToken = (user)=>{
    const token = jwt.sign({
        _id:user._id,
        name:user.name,
        email:user.email,
        role:user.role,
        tokenType:config.tokens.accessToken.type
    },config.secret,{expiresIn: config.tokens.accessToken.expiresIn});
    return 'Bearer '+token;
};
const generateRefreshToken = (user)=>{
    const token = jwt.sign({
        _id:user._id,
        tokenType:config.tokens.refreshToken.type
    },config.secret,{expiresIn: config.tokens.refreshToken.expiresIn});
    return 'Bearer '+token;
};

module.exports = {
    generateRefreshToken,
    generateAccessToken
};