var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var productSchema   = new Schema({
	_id : Number,
	name: {type:String,required:true},
	prices : [{
		value : Number,
		startDate : Date,
		endDate : Date
	}],
	quantityInPkg : Number,
	imageUrl : String,
	description : String,
	maxQuantityInOrder : {type:Number,default:Number.MAX_VALUE}
});

module.exports = productSchema;