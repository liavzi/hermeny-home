var config = require("./IntegrationTestConfig.json");
var request = require("superagent");


function Service(serviceName){
	this.serviceName =	serviceName;
}

Service.prototype.getAll = function(callback){
    request
        .get(config.serverUrl+"/"+this.serviceName)
        .end(function(res){
            callback(res.error,res.body);
        });
};

Service.prototype.getById = function(id,callback){
	request
		.get(config.serverUrl+"/"+this.serviceName+"/"+id)
		.end(function(res){
			callback(res.error,res.body);
		});
};

Service.prototype.post = function(data,callback){
	request
		.post(config.serverUrl+"//"+this.serviceName)
		.send(data)
		.end(function(res){
			callback(res.error,res.body);
		});
};

Service.prototype.put = function(data,callback){
    request
        .put(config.serverUrl+"/"+this.serviceName+"/"+data._id)
        .send(data)
        .end(function(res){
            callback(res.error,res.body);
        });
};

module.exports = Service;