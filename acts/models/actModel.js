const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let ActsSchema = new Schema({
    username: {type: String, required: true},
    categoryName:{type: String, required:true},
    actid: {type: Number, required: true, unique:true},
    caption: {type: String, required: true},
    upvotes: {type: Number,default:0},
    timestamp : { type : String,required: true},
    imgB64: {type: String, required: true}
});
module.exports = mongoose.model('Act', ActsSchema);