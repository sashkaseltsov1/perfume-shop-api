const mongoose = require('mongoose');

const brandSchema = mongoose.Schema({
    id:mongoose.Schema.Types.ObjectId,
    name:{
        type:String,
        required:true,
        unique:true,
        index: true,
    }
});

module.exports = mongoose.model('Brand', brandSchema);