const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const path = require('path');
const filters = require('./src/routes/filters');
const products = require('./src/routes/products');
const auth = require('./src/routes/auth');
const user = require('./src/routes/user');
const orders = require('./src/routes/orders');

const app = express();

app.use(passport.initialize());
require('./src/middlewares/passport')(passport);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('images'));
app.use((req, res, next)=> {
    let allowedOrigins = ['http://176.197.36.4:3000', 'http://localhost:3000'];
    let origin = req.headers.origin;
    if(allowedOrigins.indexOf(origin) > -1){
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers','X-Requested-With,Content-type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials','true');
    next();
});

app.use('/api/filters', filters);
app.use('/api/products', products);
app.use('/api/auth', auth);
app.use('/api/user', user);
app.use('/api/orders', orders);

if(process.env.NODE_ENV==='production'){
    app.use('/', express.static(path.join(__dirname, 'perfume-shop', 'build')));
    app.get('*', (req, res)=>{
        res.sendFile(path.join(__dirname, 'perfume-shop', 'build', 'index.html'));
    })
}

module.exports=app;