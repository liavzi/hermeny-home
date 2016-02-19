///<reference path="../../../typings/tsd.d.ts" />
var GenericService = require("./genericService");
import mongoose = require("mongoose");
var TagService = function(){};
var Tag : mongoose.Model<any>= require("../models/TagModel");
TagService.prototype = new GenericService(Tag);

TagService.prototype.getAll = function(searchCriteria,callback){
    var query =  Tag.find({});
    if (searchCriteria.type)
        query
        .where("type").equals(searchCriteria.type)
        .sort("order")
    query.exec(callback);
};

var tagService = new TagService();

export = tagService;