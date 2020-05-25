const strategy = require('passport-jwt').Strategy;
const extract = require('passport-jwt').ExtractJwt;
const config = require('../../config');
const User = require('../models/user');
const opt = {
    jwtFromRequest:extract.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.secret
};

module.exports = passport=>{
    passport.use(new strategy(opt, async(payload, done)=>{
        console.log(payload)
        try{
            const user = await User.findById(payload._id).select('_id name email role');
            if(user){
                done(null, user);
            }else{
                done(null, false);
            }
        }catch (e) {
            console.log(e);
        }
    }))
};