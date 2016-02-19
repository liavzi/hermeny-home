var mongoose = require('mongoose');
var priceSchema = require('../schemas/priceSchema');
var Price = mongoose.model("Price",priceSchema);
module.exports = Price;
