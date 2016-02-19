///<reference path="../../../typings/tsd.d.ts" />
import Order = require("../models/OrderModel");
import orderSchema = require("../schemas/orderSchema");
import config = require("config");
let shipmentFee = <number>config.get("order.shipmentFee");
class OrderFactory{	
	createNewOrder(cb:(err:Error,order? : orderSchema.IOrder)=>any){
		var newOrder = new Order();
		newOrder.status = orderSchema.OrderStatus.open;
		newOrder.shipmentFee = shipmentFee;
		newOrder.save<orderSchema.IOrder>((err,newOrder)=>{
			if (err) return cb(err);
			cb(null,newOrder); 
		});
	}
}

export = new OrderFactory();