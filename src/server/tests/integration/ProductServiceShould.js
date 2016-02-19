var chai = require("chai");
var expect = chai.expect;
var serverActor = require("./framework/serverActor");
var async = require("async");
var testUtils = require("./framework/testUtils");

describe('ProductService', function(){
    it('should create a new product when using put', function(done){
        var product = testUtils.createProductObject("PutTestProduct");
        serverActor.productService.put(product,function(err,res){
            serverActor.productService.getById(product._id,function(err,savedProduct){
                expect(savedProduct.name).to.equal("PutTestProduct");
                done();
            });
        });
    });

    it('should update existing product using put', function(done){
        var product = testUtils.createProductObject("PutTestProduct");
        serverActor.productService.put(product,function(err,savedProduct){
            expect(savedProduct.name).to.equal("PutTestProduct");
            savedProduct.name = "NameAfterUpdate";
            serverActor.productService.put(savedProduct,function(){
                serverActor.productService.getById(savedProduct._id,function(err,secondProduct){
                    expect(secondProduct.name).to.equal("NameAfterUpdate");
                    done();
                });
            });
        });
    });

    it('should return all products', function(done){
        async.parallel([
            function(callback){testUtils.createProduct("GetAllProduct1",callback);},
            function(callback){testUtils.createProduct("GetAllProduct2",callback);},
            function(callback){testUtils.createProduct("GetAllProduct3",callback);}],
            function(err,results){
                serverActor.productService.getAll(function(err,products){
                    expect(products.some(function(x){return x.name==="GetAllProduct1";})).to.be.true();
                    expect(products.some(function(x){return x.name==="GetAllProduct2";})).to.be.true();
                    expect(products.some(function(x){return x.name==="GetAllProduct3";})).to.be.true();
                    done();
                });
            }
        );
    });
});
