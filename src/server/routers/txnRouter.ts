///<reference path="../../../typings/tsd.d.ts" />
import express = require('express');
import querystring = require('querystring');
import request = require('request');
import Order = require("../models/OrderModel");
import orderShcema = require("../schemas/orderSchema");
import config = require("config");
let router = express.Router();


router.route("/txn")
    .post(function(req, res){
    // console.log('Received POST /');
    // console.log(req.body);
    // console.log('\n\n');

    // STEP 1: read POST data
    req.body = req.body || {};
    res.send(200, 'OK');
    res.end();

    // read the IPN message sent from PayPal and prepend 'cmd=_notify-validate'
    var postreq = 'cmd=_notify-validate';
    for (var key in req.body) {
        if (req.body.hasOwnProperty(key)) {
            var value = querystring.escape(req.body[key]);
            postreq = postreq + "&" + key + "=" + value;
        }
    }

    // Step 2: POST IPN data back to PayPal to validate
    // console.log('Posting back to paypal');
    // console.log(postreq);
    // console.log('\n\n');
    var options = {
        url: config.get<string>("paypal.confirmUrl"),
        method: 'POST',
        headers: {
            'Connection': 'close'
        },
        body: postreq,
        strictSSL: true,
        rejectUnauthorized: false,
        requestCert: true,
        agent: false
    };

    request(options, function callback(error, response, body) {
      if (!error && response.statusCode === 200) {

        // inspect IPN validation result and act accordingly
        if (body.substring(0, 8) === 'VERIFIED'){
            // The IPN is verified, process it
            // console.log('Verified IPN!');
            // console.log('\n\n');
         
            //Lets check a variable
            // console.log("Checking variable");
            // console.log('\n\n');
            let invoice = req.body["invoice"];
            Order.findById(invoice,(err,order)=>{
                if (err || !order || order.status===orderShcema.OrderStatus.paid) return;
                order.markAsPaid(req.body,(err)=>{
                    if (err) return;
                    order.save();
                });              
            });                   
        } else if (body.substring(0, 7) === 'INVALID') {
            // IPN invalid, log for manual investigation
            console.log('Invalid IPN!');
            console.log('\n\n');
        }
      }
    });
});

export = router;