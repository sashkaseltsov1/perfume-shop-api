const mongoose = require('mongoose');

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
    amount:{
        type:Number,
        required:true,
    },
    fullPrise:{
        type:Number,
        required:true,
    },
    count:{
        type:Number,
        default:0
    },
    stars:{
        type:Number,
        default: 0
    },
    description:{
        type:String,
        default: 'Some description'
    },
    isDiscount:{
        type:Boolean,
        default:false

    },
    discountPrise:Number,
    isNovelty: {
        type:Boolean,
        default: false
    },
    image:String,
    brand:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Brand',
        required:true,
    },
    gender:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Gender',
        required:true,
    },
    fragrance:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Fragrance',
    }],
    perfumeType:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'PerfumeType',
        required:true,
    },
    comments:{
        type:[commentSchema],
    },
});

module.exports = mongoose.model('Product', productSchema);