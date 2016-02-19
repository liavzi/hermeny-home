///<reference path="../../../typings/tsd.d.ts" />

var addItemToOrderRouter = require("./addItemToOrderRouter");
var orderLinesRouter = require("./orderLinesRouter");
import addCoupon = require("./addCoupon");
import paypalButtonRouter = require("./paypalButtonRouter");
import express = require("express");

var orderRouter = express.Router();
orderRouter.get("/",function(req:any,res,next){
	res.json(req.order);
	res.end();
});
orderRouter.use(addItemToOrderRouter);
orderRouter.use(orderLinesRouter);
orderRouter.use(paypalButtonRouter);
orderRouter.use(<any>addCoupon);

export = orderRouter;


