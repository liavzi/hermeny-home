///<reference path="../../../typings/tsd.d.ts" />
import mongoose = require('mongoose');
import orderSchema = require('../schemas/orderSchema');
var Order = mongoose.model<orderSchema.IOrder>("Order",orderSchema.orderSchema);

interface OrderModel extends mongoose.Model<orderSchema.IOrder>{
}


export = <OrderModel> Order;




