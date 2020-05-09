const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const app = express();
const initDefaultValues = require('./src/schemas/initDefaultValues');
const port = 8000;
app.use(bodyParser.urlencoded({ extended: true }));

require('./src/routes')(app);

mongoose.connect("mongodb://localhost:27017/perfume_shop",{useNewUrlParser: true, useUnifiedTopology:true},function(err){
    if(err) return console.log(err);

    mongoose.connection.db.listCollections().toArray((err, names)=> {
        if (err) return console.log(err);
        else if(names.length===0) initDefaultValues();
    });

    app.listen(port, ()=>{
        console.log("Server started.");
    });
});

