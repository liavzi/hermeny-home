///<reference path="../../../typings/tsd.d.ts" />
var mongoose = require('mongoose');
var orderSchema = require('../schemas/orderSchema');
var Order = mongoose.model("Order", orderSchema.orderSchema);
module.exports = Order;
