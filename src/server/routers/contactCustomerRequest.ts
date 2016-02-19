///<reference path="../../../typings/tsd.d.ts" />
import ContactCustomerRequestModel = require("../models/ContactCustomerRequest");
let ContactCustomerRequest = ContactCustomerRequestModel.contactCustomerRequestModel;
import express = require("express");
let  contactCustomerRequest = express.Router();
import  users = require("../businessComponents/users");
contactCustomerRequest.route("/contactCustomerRequests")
	.get(users.ensureAdmin,function(req,res,next){
		ContactCustomerRequest.find({},(err,requests)=>{
			if (err) return next(err);
			res.json(requests).end();
		});
	})
	.post(function(req,res,next){
        ContactCustomerRequest.create(req.body,(err,request)=>{
           if (err) return next(err);
           res.json(request).end(); 
        });
    });

contactCustomerRequest.route("/contactCustomerRequests/:id")
    .get(users.ensureAdmin,function (req,res,next){
        ContactCustomerRequest.findById(req.params.id,(err,request)=>{
           if (err) return next(err);
           res.json(request).end(); 
        });
    })
    .delete(users.ensureAdmin,function(req,res,next){
        ContactCustomerRequest.findByIdAndRemove(req.params.id,(err,request)=>{
           if (err) return next(err);
           res.json(request).end(); 
        });
    });




export = contactCustomerRequest;