const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    id:mongoose.Schema.Types.ObjectId,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    products:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
    }],
    address:{
        type:String,
        required:true
    },
    paymentType:{
        type:String,
        required:true
    },
    state:{
      type:String,
      default: 'Принят на рассмотрение'
    },
    deliveryType:{
        type:String,
        required:true
    },
    totalPrise:{
        type:Number,
        required:true
    },
    createdAt: {
        type:Date,
        default:Date.now()
    },
    history:[{
        state:String,
        date:Date
    }]
});

module.exports = mongoose.model('Order', orderSchema);