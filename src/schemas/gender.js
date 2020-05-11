const mongoose = require('mongoose');

const genderSchema = mongoose.Schema({
    id:mongoose.Schema.Types.ObjectId,
    type:{
        type:String,
        required:true,
        unique:true,
        index: true,
    }
});

module.exports = mongoose.model('Gender', genderSchema);