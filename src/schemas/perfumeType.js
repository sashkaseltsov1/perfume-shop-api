const mongoose = require('mongoose');

const perfumeTypeSchema = mongoose.Schema({
    id:mongoose.Schema.Types.ObjectId,
    type:{
        type:String,
        required:true,
        unique:true,
        index: true,
    },
    products:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ]
});

module.exports = mongoose.model('PerfumeType', perfumeTypeSchema);