const jwt = require('jsonwebtoken');
const secret = require('../../config').secret;

module.exports = (req, res, next)=>{
    const authHeader = req.get('Authorization');
    if(!authHeader) return req.status(401).json({message:'Token not provided!'});

    const token = authHeader.replace('Bearer ', '');
    try{
        jwt.verify(token, secret)
    }catch (e) {
        if(e instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({message:'Invalid token!'});
        }
    }
    next();
};