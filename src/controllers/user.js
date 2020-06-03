const bcrypt = require('bcryptjs');
const User = require('../models/user');
const errorHandler = require('./utils/error-handler');
const min6max20 = require('./utils/validators/length-validators').min6max20;

module.exports.getUser = async (req, res)=>{
    try {
        let user = await User.findById(req.user._id, '-_id -password -refreshToken').populate({
            path: 'orders', select: '_id address createdAt state totalPrise',
            options: {sort: {'createdAt': -1}, limit: 10}
        });
        if (user) {
            res.status(200).json({user});
        } else {
            errorHandler(res, 404, null, 'User not found');
        }
    } catch (e) {
        errorHandler(res, 400, e);
    }
};

module.exports.editUser = async (req, res)=>{
    let user;
    try {
        user = await User.findById(req.user._id);
    }catch (e) {
        errorHandler(res, 500, e);
        return;
    }
    if(!user) {
        errorHandler(res, 404, null, 'User not found');
        return;
    }
    if(req.body.password && req.body.newPassword){
        if (!min6max20(req.body.password) || !min6max20(req.body.newPassword)) {
            errorHandler(res, 412,null, 'Password has invalid length');
            return;
        }
        const isValidPassword = bcrypt.compareSync(req.body.password, user.password);
        if(!isValidPassword) {
            errorHandler(res, 400, null, 'Введен неверный пароль');
            return;
        }
        let salt = bcrypt.genSaltSync(10);
        user.password = bcrypt.hashSync(req.body.newPassword, salt);
    }else{
        if(req.body.newPassword){
            errorHandler(res, 400, null, 'Введите старый пароль');
            return;
        }
    }
    user.name=req.body.name;
    user.lastname=req.body.lastname;
    user.phone=req.body.phone;
    user.address = req.body.address;
    try {
        await user.save();
        res.status(200).json({message:'User is updated'})
    }catch (e) {
        errorHandler(res, 500, e);
    }
};