///<reference path="../../../typings/tsd.d.ts" />
var Order = require("../models/OrderModel");
var orderSchema = require("../schemas/orderSchema");
var config = require("config");
var shipmentFee = config.get("order.shipmentFee");
var OrderFactory = (function () {
    function OrderFactory() {
    }
    OrderFactory.prototype.createNewOrder = function (cb) {
        var newOrder = new Order();
        newOrder.status = 0 /* open */;
        newOrder.shipmentFee = shipmentFee;
        newOrder.save(function (err, newOrder) {
            if (err)
                return cb(err);
            cb(null, newOrder);
        });
    };
    return OrderFactory;
})();
module.exports = new OrderFactory();
