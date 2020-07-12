const mongoose = require('mongoose');
const config = require('../../config');

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
    },
    isRemoved:{
        type:Boolean,
        default:false
    },
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
    image:{
        type:String,
        get:(value)=>{
            return `${config.apiUrl}:${config.port}/${value}`;
        }
    },
    brand:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Brand',
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
        ref:'PerfumeType',
    },
    comments:{
        type:[commentSchema],
    },
    commentsCount:{
        type:Number,
        default:0
    }
},{
    toJSON: {getters: true},
    toObject: {getters: true}
});

module.exports = mongoose.model('Product', productSchema);