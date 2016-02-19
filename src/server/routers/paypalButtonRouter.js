///<reference path="../../../typings/tsd.d.ts" />
var express = require("express");
var request = require("request");
var querystring = require("querystring");
var config = require("config");
var paypalButtonRouter = express.Router();
paypalButtonRouter.get("/paypalButton", function (req, res, next) {
    request.post({
        url: config.get("paypal.nvpApiUrl"),
        form: {
            USER: config.get("paypal.user"),
            PWD: config.get("paypal.password"),
            SIGNATURE: config.get("paypal.signature"),
            VERSION: 124,
            METHOD: "BMCreateButton",
            BUTTONCODE: "ENCRYPTED",
            BUTTONTYPE: "BUYNOW",
            L_BUTTONVAR1: "item_name=סכום הזמנה",
            L_BUTTONVAR2: "amount=" + req.order.total,
            L_BUTTONVAR3: "currency_code=ILS",
            L_BUTTONVAR4: "cn=הוסף הנחיות מיוחדות למוכר",
            L_BUTTONVAR5: config.get("paypal.returnUrl"),
            L_BUTTONVAR6: config.get("paypal.cancelUrl"),
            L_BUTTONVAR7: "shipping=" + req.order.shipmentFee,
            L_BUTTONVAR8: "invoice=" + req.order._id
        }
    }, function (err, httpResponse, body) {
        var response = querystring.parse(body);
        res.end(response.WEBSITECODE);
    });
});
module.exports = paypalButtonRouter;
