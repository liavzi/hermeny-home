var express = require("express");
var productForSellingService = require("../services/productForSellingService");
var productForSellingRouter = express.Router();
productForSellingRouter.route("/productForSelling")
    .get(function(req,res,next){
        productForSellingService.getAll(req.query,function(err,products){
            if (err) next(err);
            res.json(products);
            res.end();
        });
    });
productForSellingRouter.route("/productForSelling/:productId")
    .get(function (req,res,next){
        productForSellingService.getById(req.params.productId,function(err,product){
            if (err) next(err);
            res.json(product);
            res.end();
        });
    });
module.exports = productForSellingRouter;

