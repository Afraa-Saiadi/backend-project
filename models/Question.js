const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const{ User} = require(User);

const questionSchema = new Schema({
    question:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},{timestamps:true})

questionSchema.virtual('url').get(function(){
    return '/question/:id' + this._id
 })


const Question = mongoose.model('Question',questionSchema)
module.exports={
    Question
}