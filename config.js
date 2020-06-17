module.exports = {
    dbUrl: 'mongodb://localhost:27017/perfume_shop',
    apiUrl:'http://176.197.36.4',
    port:8000,
    secret: 'R2d2F4aaa',
    tokens:{
        accessToken:{
            type:'access',
            expiresIn:60*5
        },
        refreshToken:{
            type:'refresh',
            expiresIn:604800
        }
    }
};