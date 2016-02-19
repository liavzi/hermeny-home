var Order = require("../models/OrderModel");
var itemSeller = require("../businessComponents/itemSeller");
var addItemToOrderService = {};
addItemToOrderService.addItemToOrder = function(request,callback){
    itemSeller.sell(request.order,request.saleInfo,function(err,order){
        if (err)  return callback(err);
        order.save(callback);
    });
};

module.exports = addItemToOrderService;