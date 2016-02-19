var serverActor = require("./serverActor");
var testUtils = {
    randomInt : function (low, high) {
        return Math.floor(Math.random() * (high - low) + low);
    },
    createProductObject : function(name){
        return {
            _id : this.randomInt(1,500000),
            name : name

        };
    },
    createProduct : function(name,callback){
        var product = this.createProductObject(name);
        serverActor.productService.put(product,callback);
    },

    createPrice : function(productId,price,callback){
        serverActor.priceService.put({productId:productId,value:price},callback);
    },

    createProductWithPrice: function(name,price,callback){
        var createPrice = this.createPrice;
        this.createProduct(name,function(err,product){
           createPrice(product._id,price,function(err,returnedPrice){
               product.price  = returnedPrice.value;
               callback(err,product);
           });
        });
    }
};
module.exports = testUtils;