const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({

    username:{
        type: String,
        required: true,
        unique: true
    },
    fullName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        minLength: 6
    },
    following:[
        {type : Schema.Types.ObjectId,
            ref: 'User',
            default: []
        }
    ],
    followers:[
        {type : Schema.Types.ObjectId,
            ref: 'User',
            default: []
        }
    ],
    profileImg:{
        type: String,
        default: ''
    },
    coverImg:{
        type: String,
        default:''
    },
    bio:{
        type: String,
        default: ''
    },
    link:{
        type: String,
        default: ''
    }


},{timestamps:true})

module.exports = mongoose.model('User',User)