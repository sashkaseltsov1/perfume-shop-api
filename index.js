const express        = require('express');
const mongoose = require('mongoose')
const bodyParser     = require('body-parser');
const app            = express();
const port = 8000;
app.use(bodyParser.urlencoded({ extended: true }));

require('./src/routes')(app);

mongoose.connect("mongodb://localhost:27017/perfume_shop",{useNewUrlParser: true, useUnifiedTopology:true},function(err){
    if(err) return console.log(err);

    app.listen(port, function(){
        console.log("Server started");
    });
});

