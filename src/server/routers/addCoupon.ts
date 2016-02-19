///<reference path="../../../typings/tsd.d.ts" />
import express = require("express");
let  addCoupon = express.Router();
import orderFactory = require("../businessComponents/orderFactory");
import R = require("./registerRouters");
import config = require("config");
import BusinessError  = require("../errors/BusinessError");
let couponName= config.get<string>("coupon.name");
let minOrder = config.get("coupon.minOrder");
addCoupon.route("/coupons")
    .post(function(req  : R.OrderActionRequest,res : express.Response,next){
        let coupon :string = req.body.coupon;
        req.order.addCoupon(coupon,(err,order)=>{
            if (err) return next(err);
            order.save((err,order)=>{
                if (err) return next(err);
                res.json(order).end();
            });
        });
    });

export = addCoupon;