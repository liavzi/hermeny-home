var Order = require("../models/OrderModel");
var orderLinesService = {};
orderLinesService.removeLineFromOrder = function(request,callback){
    var order = request.order;
    order.removeLineById(request.orderLineId);
    order.save(function(err){
        if (err) return callback(err);
        callback(null,order);
    });
};

module.exports = orderLinesService;