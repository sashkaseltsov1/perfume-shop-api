const mongoose = require('mongoose');

const AmountSchema = mongoose.Schema({
    amount:{
        type:Number,
        required:true
    },
    cost:{
        type:Number,
        required:true
    },
    count:{
        type:Number,
        required:true
    },
    isDiscount:{
        type:Boolean,
        default:false
    },
    discountCost:{
        type:Number,
        default:undefined
    }
});

const commentSchema = mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    stars:{
        type:Number,
        required:true
    },
    message:{
        type:String,
        default:undefined
    },
    created:{ type: Date, default: Date.now }
});

const productSchema = mongoose.Schema({
    id:mongoose.Schema.Types.ObjectId,
    name:{
        type:String,
        required:true,
    },
    brand:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Brand',
        required:true,
    },
    gender:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Gender',
    },
    fragrance:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Fragrance',
    }],
    perfumeType:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'PerfumeType'
    },
    comments:{
        type:[commentSchema],
        default: undefined
    },
    amounts:{
        type:[AmountSchema],
        default:undefined
    },
    stars:{
        type:Number,
        default: 0
    },
    description:{
        type:String,
        default: 'Some description'
    },
    new: {
        type:Boolean,
        default: false
    },
    image:Buffer
});

module.exports = mongoose.model('Product', productSchema);