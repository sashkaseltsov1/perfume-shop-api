const mongoose = require('mongoose');
const app = require('./app');
const initDefaultValues = require('./src/models/init-default-values');
const config = require('./config');

mongoose.set('useFindAndModify', false);
mongoose.connect(config.dbUrl,
    {useNewUrlParser: true, useUnifiedTopology: true},
    (err) => {
        if (err) return console.log(err);

        mongoose.connection.db.listCollections().toArray((err, names) => {
            if (err) return console.log(err);
            else if (names.length === 0) initDefaultValues();
        });

        app.listen(config.port, () => console.log("Server started."));
    });



