const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    id:mongoose.Schema.Types.ObjectId,
    genderType:{
      type:String,
      enum:['Man', 'Woman', 'Niche']
    },
    title:String,
    cost:Number,
});

module.exports = mongoose.model('Product', productSchema);