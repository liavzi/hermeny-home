var Product = require("../models/ProductModel");

var priceList = {};
priceList.getPrice =function (productId, callback) {
    Product.findById(productId,function(err,product){
        var prices = product.prices;
        if (prices.length === 0) {
            var noPriceError = new Error("no price for product " + productId);
            noPriceError.name = "NoPriceForProduct";
            return callback(noPriceError);
        }
        callback(null, prices[0]);
    });
};

module.exports = priceList;