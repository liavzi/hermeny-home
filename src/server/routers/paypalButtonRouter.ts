///<reference path="../../../typings/tsd.d.ts" />
import express = require("express");
import R = require("./registerRouters");
import request = require("request");
import querystring = require("querystring");
import config = require("config");
let paypalButtonRouter  = express.Router();
paypalButtonRouter.get("/paypalButton",(req : R.OrderActionRequest,res :express.Response,next)=>{
	request.post({
		url: config.get<string>("paypal.nvpApiUrl"),
		form : {
			USER : config.get<string>("paypal.user"),
			PWD : config.get<string>("paypal.password"),
			SIGNATURE : config.get<string>("paypal.signature"),
			VERSION : 124,
			METHOD : "BMCreateButton",
			BUTTONCODE : "ENCRYPTED",
			BUTTONTYPE : "BUYNOW",
			L_BUTTONVAR1 : "item_name=סכום הזמנה",
            L_BUTTONVAR2 : `amount=${req.order.total}`,
			L_BUTTONVAR3 : "currency_code=ILS"
			,L_BUTTONVAR4 : "cn=הוסף הנחיות מיוחדות למוכר"
			,L_BUTTONVAR5 : config.get("paypal.returnUrl")
			,L_BUTTONVAR6 : config.get("paypal.cancelUrl")
			,L_BUTTONVAR7 : `shipping=${req.order.shipmentFee}`
			,L_BUTTONVAR8 : `invoice=${req.order._id}`
		}	
	},function(err,httpResponse,body){
		let response = querystring.parse(body);
		res.end(response.WEBSITECODE);
	});
});
export = paypalButtonRouter;