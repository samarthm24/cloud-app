const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let CategorySchema = new Schema({
    categoryName: {type: String, required: true,unique: true},
    no_acts: {type: Number, required: true,default:0}
});
module.exports = mongoose.model('Category', CategorySchema);