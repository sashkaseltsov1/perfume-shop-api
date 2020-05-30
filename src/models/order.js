const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    id:mongoose.Schema.Types.ObjectId,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    products:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true
    }],
    address:{
        type:String,
        required:true
    },
    paymentType:{
        type:String,
        enum:['Наложенный платеж'],
        default: 'Наложенный платеж',
    },
    state:{
        type:String,
        enum:['Принят на рассмотрение', 'Одобрен', 'Доставка','Завершен'],
        default: 'Принят на рассмотрение'
    },
    totalPrise:{
        type:Number,
        required:true
    },
    history:[{
        state:String,
        date:Date,
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);