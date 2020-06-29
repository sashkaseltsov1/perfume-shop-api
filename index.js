const mongoose = require('mongoose');
const app = require('./app');
const initDefaultValues = require('./src/models/init-default-values');
const config = require('./config');
const fs = require('fs');

mongoose.set('useFindAndModify', false);
mongoose.connect(config.dbUrl,
    {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex : true },
    (err) => {
        if (err) return console.log(err);

        mongoose.connection.db.listCollections().toArray((err, names) => {
            if (err) return console.log(err);
            else if (names.length === 0) initDefaultValues();
        });
        const uploads = './uploads';
        const images = './images';

        if (!fs.existsSync(uploads)){
            fs.mkdirSync(uploads);
        }
        if (!fs.existsSync(images)){
            fs.mkdirSync(images);
        }
        app.listen(config.port, () => console.log("Server started."));
    });
