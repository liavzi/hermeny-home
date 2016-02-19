var priceList = require("./priceList");

var itemSeller = {};
itemSeller.sell = function(order,saleInfo,callback){
    priceList.getPrice(saleInfo.productId,function(err,price){
        if (err) callback(err);
        else
        {
            var orderLine ={};
            orderLine.totalPrice = price.value * saleInfo.quantity;
            orderLine.quantity = saleInfo.quantity;
            orderLine.productId = saleInfo.productId;
            order.addOrderLine(orderLine,function(err){
                if (err) return callback(err);
                callback(null,order);
            });        
        }
    });
};

module.exports = itemSeller;