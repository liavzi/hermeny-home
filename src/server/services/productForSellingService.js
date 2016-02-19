var productForSellingRepository = require("../businessComponents/productForSellingRepository");

var productForSellingService = {
    getAll : function(searchCriteria,callback){
        productForSellingRepository.getAll(searchCriteria,callback);
    },
    getById : function(productId,callback){
        productForSellingRepository.getById(productId,callback);
    }
};

module.exports = productForSellingService;