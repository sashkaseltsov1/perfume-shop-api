module.exports = {
    dbUrl: 'mongodb+srv://admin:password@clusterperfumeshop-taas5.gcp.mongodb.net/ClusterPerfumeShop?retryWrites=true&w=majority',
    apiUrl:'http://176.197.36.4',
    port:8000,
    secret: 'JWTSecret',
    allowedOrigins:[
        'http://176.197.36.4:3000', 'http://localhost:3000'
    ],
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