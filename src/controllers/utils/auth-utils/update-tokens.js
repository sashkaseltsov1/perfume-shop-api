const {generateAccessToken, generateRefreshToken} = require('./generate-tokens');

module.exports = (res, user)=>{
    let token = generateAccessToken(user);
    let refreshToken = generateRefreshToken(user);
    user.refreshToken=refreshToken;
    try{
        user.save()
    }catch (e) {
        res.status(401).json({message:e.message?e.message:e});
        return true;
    }
    res.status(200).json({token:token, refreshToken:refreshToken});
    return true;
};