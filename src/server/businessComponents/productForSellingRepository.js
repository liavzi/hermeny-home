var Product = require("../models/ProductModel");
var _ = require("underscore");
var Price = require("../models/PriceModel");
var priceList = require("./priceList");
var async = require("async");
var Tag = require("../models/TagModel");
var productForSellingRepository = {};
productForSellingRepository.getById = function (productId, callback) {
    Product.findById(productId, function (err, product) {
        if (err)
            return callback(err);
        var productForSelling = createProductForSelling(product);
        if (!productForSelling.price) {
            var error = new Error();
            error.name = "NoPriceForProduct";
            return callback(error);
        }
        callback(null, productForSelling);
    });
};
productForSellingRepository.getAll = function (searchCriteria, callback) {
    var productWithPrices = [];
    var getById = this.getById;
    Tag.findById(searchCriteria.tagId, function (err, tag) {
        if (err)
            return callback(err);
        Product.where("_id").in(tag.productIds).exec(function (err, products) {
            if (err)
                return callback(err);
            var prodcutsDic = _.object(_.map(products, function (x) { return [x._id, x]; }));
            _.each(tag.productIds, function (productId) {
                var currentProduct = prodcutsDic[productId];
                if (!currentProduct)
                    return;
                var productForSelling = createProductForSelling(currentProduct);
                if (!productForSelling.price)
                    return;
                productWithPrices.push(productForSelling);
            });
            callback(null, productWithPrices);
        });
    });
};
function createProductForSelling(dbProduct) {
    var productForSelling = dbProduct.toObject();
    if (dbProduct.prices && dbProduct.prices.length > 0)
        productForSelling.price = dbProduct.prices[0];
    return productForSelling;
}
module.exports = productForSellingRepository;
