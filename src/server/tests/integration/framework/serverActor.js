var Service = require("./Service");

var serverActor = {
	productService : new Service("products"),
	priceService : new Service("prices"),
	productForSellingService : new Service("productForSelling")
};

module.exports = serverActor;