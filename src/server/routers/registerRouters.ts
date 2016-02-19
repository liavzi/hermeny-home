///<reference path="../../../typings/tsd.d.ts"/>
import e = require("express");
var productForSellingRouter = require("./productForSellingRouter");
var genericRouter = require("./genericRouter");
var orderRouter = require("./orderRouter");
import Order = require("../models/OrderModel");
import orderSchema = require("../schemas/orderSchema");
import validationErrorHandler = require("./validationErrorHandler");
import imagesRouter = require("./imagesRouter");
import txnRouter = require("./txnRouter");
import contactCustomerRequest = require("./contactCustomerRequest");
function registerRouters (express,app){
    var apiRouter = express.Router();
    apiRouter.use(productForSellingRouter);
    apiRouter.use(txnRouter)
    apiRouter.use(imagesRouter);
    apiRouter.use("/myOrder",loadOrder);
    apiRouter.use("/myOrder",orderRouter);
    apiRouter.use(contactCustomerRequest);
    apiRouter.use(genericRouter);
    apiRouter.use(validationErrorHandler);
    app.use("/api",apiRouter);
}

export interface RequestWithSession extends e.Request{
    session :any;
}

export interface OrderActionRequest extends RequestWithSession{
    order :orderSchema.IOrder;
}


function loadOrder(req : OrderActionRequest,res,next){
    if (req.path.indexOf("items")!==-1 && !req.session.orderId)
        return next();
    Order.findById(req.session.orderId, function (err,order) {
        if (err) return next(err);
        if (!order || order.status === orderSchema.OrderStatus.paid){
            req.session.orderId = null;
        }
        else
            req.order = order;
        next();
    });
}

module.exports = registerRouters;