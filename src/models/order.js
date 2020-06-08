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
        enum:['Наложенный платёж'],
        required:true
    },
    deliveryType:{
        type:String,
        enum:['Почта России', 'EMS', 'CDEK', 'DPD'],
        required:true
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