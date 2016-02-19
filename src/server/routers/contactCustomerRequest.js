///<reference path="../../../typings/tsd.d.ts" />
var ContactCustomerRequestModel = require("../models/ContactCustomerRequest");
var ContactCustomerRequest = ContactCustomerRequestModel.contactCustomerRequestModel;
var express = require("express");
var contactCustomerRequest = express.Router();
var users = require("../businessComponents/users");
contactCustomerRequest.route("/contactCustomerRequests")
    .get(users.ensureAdmin, function (req, res, next) {
    ContactCustomerRequest.find({}, function (err, requests) {
        if (err)
            return next(err);
        res.json(requests).end();
    });
})
    .post(function (req, res, next) {
    ContactCustomerRequest.create(req.body, function (err, request) {
        if (err)
            return next(err);
        res.json(request).end();
    });
});
contactCustomerRequest.route("/contactCustomerRequests/:id")
    .get(users.ensureAdmin, function (req, res, next) {
    ContactCustomerRequest.findById(req.params.id, function (err, request) {
        if (err)
            return next(err);
        res.json(request).end();
    });
})
    .delete(users.ensureAdmin, function (req, res, next) {
    ContactCustomerRequest.findByIdAndRemove(req.params.id, function (err, request) {
        if (err)
            return next(err);
        res.json(request).end();
    });
});
module.exports = contactCustomerRequest;
