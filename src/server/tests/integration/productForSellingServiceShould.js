var chai = require("chai");
var expect = chai.expect;
var serverActor = require("./framework/serverActor");
var async = require("async");
var testUtils = require("./framework/testUtils");

describe('productForSellingService should', function(){
    it('return a product with its price', function(done){
        testUtils.createProductWithPrice("someProduct",10,function(err,productWithPrice) {
            serverActor.productForSellingService.getById(productWithPrice._id,function(err,returnedProduct) {
                expect(returnedProduct._id).to.equal(productWithPrice._id);
                expect(returnedProduct.price).to.equal(10);
                done();
            });
        });
    });

    it('return all products with their prices', function(done){
        async.parallel([
            function(callback){testUtils.createProductWithPrice("productWithPrice1",5.5,callback);},
            function(callback){testUtils.createProductWithPrice("productWithPrice2",2,callback);}
        ],function(err,results){
            serverActor.productForSellingService.getAll(function(err,products){
                expect(products.some(function(x){
                    return x._id === results[0]._id && x.price === 5.5;
                })).to.be.true();
                expect(products.some(function(x){
                    return x._id === results[1]._id && x.price === 2;
                })).to.be.true();
                done();
            });
        });
    });
});
