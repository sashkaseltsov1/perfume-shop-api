const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../../config');
const updateTokens = require('./utils/auth-utils/update-tokens');
const errorHandler = require('./utils/error-handler');

module.exports.signup = async (req, res)=>{
    let candidate;
    try{
        candidate = await User.findOne({email:req.body.email});
    }catch (e) {
        errorHandler(res, 500,e);
        return;
    }
    if(candidate){
        errorHandler(res, 500,null, 'Такой пользователь уже существует');
        return;
    }
    let salt = bcrypt.genSaltSync(10);
    let password = req.body.password;
    if (password.length>30 || password.length<6) {
        errorHandler(res, 412,null, 'Password has invalid length');
        return;
    }
    let user = new User({...req.body, password:bcrypt.hashSync(password, salt)});
    try {
        await user.save();
    }catch (e) {
        errorHandler(res, 500,e);
        return;
    }
    return res.status(200).json({message:'Регистрация прошла успешно', user:user})
};

module.exports.refreshToken = async (req, res)=>{
    let decoded;
    try{
        let token = req.body.refreshToken.replace('Bearer ', '');
        decoded = jwt.verify(token, config.secret);
        if(decoded.tokenType!=='refresh'){
            errorHandler(res, 401,null,'Invalid type of token');
            return;
        }
    }catch (e) {
        errorHandler(res, 401,e);
        return;
    }

    let user;
    try {
        user = await User.findById(decoded._id);
        if(!user) {
            errorHandler(res, 401,null,'User not found');
            return;
        }
    }catch (e) {
        errorHandler(res, 401,e);
        return;
    }

    if(user.refreshToken!==req.body.refreshToken){
        errorHandler(res, 401,null,'Invalid token');
        return;
    }
    updateTokens(res, user);
};
module.exports.signin = async (req, res)=>{
    let candidate = await User.findOne({email:req.body.email});
    if(candidate){
        const isValidPassword = bcrypt.compareSync(req.body.password, candidate.password);
        if(isValidPassword){
           updateTokens(res, candidate);
        }else{
            res.status(401).json({message: 'Не верный e-mail или пароль. Попробуйте снова'})
        }
    }else{
        res.status(401).json({message: 'Не верный e-mail или пароль. Попробуйте снова'})
    }
};



