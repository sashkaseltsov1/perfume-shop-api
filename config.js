module.exports = {
    dbUrl:'mongodb://localhost:27017/perfume_shop',
    port:8000,
    secret: 'R2d2F4aaa',
    tokens:{
        accessToken:{
            type:'access',
            expiresIn:60
        },
        refreshToken:{
            type:'refresh',
            expiresIn:2*60
        }
    }
};