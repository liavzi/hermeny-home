var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var priceSchema   = new Schema({
    productId: Number,
    value : Number,
    startDate : Date,
    endDate : Date
 });

module.exports = priceSchema;