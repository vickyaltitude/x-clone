const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
  },
  img: {
    type: String,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      
      ref: "User",
    },
  ],
  comments: [
    {
      text: {
        type: String,
        required: true
      },
      user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      }
    },
  ],
},{timestamps:true});


module.exports = mongoose.model("PostSchema",PostSchema)