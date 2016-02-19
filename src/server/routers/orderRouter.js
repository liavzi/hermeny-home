///<reference path="../../../typings/tsd.d.ts" />
var addItemToOrderRouter = require("./addItemToOrderRouter");
var orderLinesRouter = require("./orderLinesRouter");
var addCoupon = require("./addCoupon");
var paypalButtonRouter = require("./paypalButtonRouter");
var express = require("express");
var orderRouter = express.Router();
orderRouter.get("/", function (req, res, next) {
    res.json(req.order);
    res.end();
});
orderRouter.use(addItemToOrderRouter);
orderRouter.use(orderLinesRouter);
orderRouter.use(paypalButtonRouter);
orderRouter.use(addCoupon);
module.exports = orderRouter;
