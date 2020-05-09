const mongoose = require('mongoose');

const fragranceSchema = mongoose.Schema({
    id:mongoose.Schema.Types.ObjectId,
    type:{
        type:String,
        required:true,
        unique:true,
        index: true,
    }
});

module.exports = mongoose.model('Fragrance', fragranceSchema);