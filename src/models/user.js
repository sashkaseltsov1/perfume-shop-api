const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    id:mongoose.Schema.Types.ObjectId,
    name:{
        type:String,
        required: [true, 'Name is required'],
        validate:{
            validator: (v)=> {
                return (v.length<=30 && v.length>=2);
            },
            message: props => `${props.value} has invalid length`
        },
    },
    lastname:{
        type:String,
        required: [true, 'Lastname is required'],
        validate:{
            validator: (v)=> {
                return (v.length<=30 && v.length>=2);
            },
            message: props => `${props.value} has invalid length`
        },
    },
    email:{
        type:String,
        required: [true, 'Email is required'],
        unique:true,
        index: true,
        validate: {
            validator: (v)=> {
                return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    password:{
        type:String,
        required: [true, 'Password is required'],
    },
    role:{
        type:String,
        enum:['Admin', 'User'],
        default:'User'
    },
    address:{
        type:String,
        default:''
    },
    phone:{
        type:String,
        default:''
    },
    orders:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Order',
    }],
    refreshToken:{
        type:String,
    }

});

module.exports = mongoose.model('User', userSchema);