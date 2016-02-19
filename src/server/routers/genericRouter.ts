import  express = require("express");
import  users = require("../businessComponents/users");
var genericRouter = express.Router();
var GenericService = require("../services/genericService");
var orderService = require("../services/orderService");
var tagService = require("../services/tagService");

var entityToService = {
    "products" :  new GenericService(require("../models/ProductModel")),
    "prices" : new GenericService(require("../models/PriceModel")),
    "orders" : orderService,
    "tags" : tagService,
};

function processRequest(req,res,next,actionName,params) {
    var entityService =  entityToService[req.params.entityName];
    if (!entityService) return next();
    entityService[actionName](params,function(err,result){
        handleErrorOrWriteToResponse(err,next,res,result);
    });
}

function handleErrorOrWriteToResponse(err, next, res, entity) {
    if (err) next(err);  
    else{
        res.json(entity);
        res.end();
    }
}
genericRouter.route("/:entityName")
    .post(users.ensureAdmin,function (req,res,next){
        processRequest(req,res,next,"create",req.body);
    })
    .get(function(req,res,next){
        if (req.params.entityName ==="orders"){
            return users.ensureAdmin(req,res,()=>{
                processRequest(req,res,next,"getAll",req.query);          
            })
        }
        processRequest(req,res,next,"getAll",req.query);
    });

genericRouter.route("/:entityName/:entityId")
    .get(function (req,res,next){
        if (req.params.entityName ==="orders"){
            return users.ensureAdmin(req,res,()=>{
                processRequest(req,res,next,"getById",req.params.entityId);
            })
        }
        processRequest(req,res,next,"getById",req.params.entityId);
    })
    .put(users.ensureAdmin,function(req,res,next){
        processRequest(req,res,next,"createOrUpdate",req.body);
    })
    .delete(users.ensureAdmin,function(req,res,next){
        processRequest(req,res,next,"deleteById",req.params.entityId);
    });

export = genericRouter;


