///<reference path="../../../typings/tsd.d.ts" />
var express = require("express");
var addCoupon = express.Router();
var config = require("config");
var couponName = config.get("coupon.name");
var minOrder = config.get("coupon.minOrder");
addCoupon.route("/coupons")
    .post(function (req, res, next) {
    var coupon = req.body.coupon;
    req.order.addCoupon(coupon, function (err, order) {
        if (err)
            return next(err);
        order.save(function (err, order) {
            if (err)
                return next(err);
            res.json(order).end();
        });
    });
});
module.exports = addCoupon;
