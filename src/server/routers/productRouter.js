var express = require("express");
var productService = require("../services/productService");
var productRouter = express.Router();
productRouter.route("/products")
	.post(function (req,res,next){
		productService.createProduct(req.body,function(err,product){
			if (err) return next(err);
			res.json(product);
			res.end();
		});		
	})
	.get(function(req,res){
		productService.getAllProducts(function(err,products){
			if (err) return res.end(err.toString());
			res.json(products);
			res.end();
		});
	});
productRouter.route("/products/:productId")
	.get(function (req,res){
		productService.getProduct(req.params.productId,function(err,product){
			if (err) return res.end(err.toString());
			res.json(product);
			res.end();
		});		
	})
	.put(function(req,res){
		productService.updateProduct(req.body,function(err,product){
			if (err) return res.end(err.toString());
            else{
                res.json(product);
                res.end();
            }
		});
	})
    .delete(function(req,res){
        productService.deleteProduct(req.params.productId,function(err,product){
            if (err) return res.end(err.toString());
            res.json(product);
            res.end();
        });
    });

module.exports = productRouter;

