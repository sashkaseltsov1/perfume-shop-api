const User = require('../models/user');
const errorHandler = require('./utils/error-handler');

module.exports.getUser = async (req, res)=>{

    if(req.user){
        try{
            let user =await User.findById(req.user._id, '-_id -password -refreshToken');
            if(user) {
                res.status(200).json({user});
            } else {
                errorHandler(res, 404,null, 'User not found');
            }
        }catch (e) {
            errorHandler(res, 400,e);
        }

    }else{
        errorHandler(res, 400,null,'Invalid user type');
    }
};

module.exports.editUser = (req, res)=>{

};