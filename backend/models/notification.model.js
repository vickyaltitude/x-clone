const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({

    from:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    to:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type:{
        type: String,
        required: true,
        enum:["follow","like"]
    },
    read:{
        type: Boolean,
        default: false
    }

},{timestamps:true})


module.exports = mongoose.model('Notification',notificationSchema);