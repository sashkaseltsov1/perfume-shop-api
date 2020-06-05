const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    username:{
        type:String,
        default:'Гость'
    },
    stars:{
        type:Number,
        required:true,
        enum:[
            1,2,3,4,5
        ]
    },
    message:{
        type:String,
        default:'...'
    }
},{
    timestamps: true
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
    commentsCount:{
        type:Number,
        default:0
    }
});

module.exports = mongoose.model('Product', productSchema);