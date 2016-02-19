var Product = require("../models/ProductModel");


var productService = {
	createProduct : function(product,callback){
		Product.create(product,function(err,savedProduct){
			if (err) callback(err);
			callback(err,savedProduct);
		});
	},
	getAllProducts : function(callback){
		Product.find({},function(err,products){
			if (err) callback(err);
			callback(err,products);
		});
	},
	getProduct : function(productId,callback){
		Product.findById(productId,function(err,product){
			if (err) callback(err);
			callback(err,product);
		});
	},
	updateProduct : function(product,callback){
        var createProduct = this.createProduct;
        Product.findById(product._id,function(err,dbProduct){
            if (err) callback(err);
            console.log("moved on!");
            if (!dbProduct)
                createProduct(product,callback);
            else
                dbProduct.update(product,callback);
        });
	}
};

productService.deleteProduct = function(productId,callback){
    Product.findById(productId).remove(callback);
};

module.exports = productService;