var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var tagSchema   = new Schema({
    name: {type:String,required:true},
    productIds : [Number],
    type : String,
    imageUrl : String,
    order : {type : Number,default : 1000}
});

module.exports = tagSchema;