///<reference path="../../../typings/tsd.d.ts" />
var _ = require("underscore");
var mongoose = require('mongoose');
var BusinessError = require("../errors/BusinessError");
var config = require("config");
var couponName = config.get("coupon.name");
var minOrder = config.get("coupon.minOrder");
var shipmentFee = config.get("order.shipmentFee");
var validator = require("validator");
var Schema = mongoose.Schema;
var Product = require("../models/ProductModel");
var orderLineSchema = new Schema({
    productId: Number,
    quantity: { type: Number, min: 1 },
    totalPrice: { type: Number, min: 0 }
});
exports.orderSchema = new Schema({
    orderLines: [orderLineSchema],
    customerDetails: {
        fullName: String,
        address: String,
        phoneNumber: { type: Number },
        email: { type: String, validate: function (value) {
                return validator.isEmail(value);
            } }
    },
    status: { type: Number, min: 0 /* open */, max: 1 /* paid */ },
    paymentInformation: {},
    paidDate: Date,
    shipmentFee: { type: Number, min: 0 },
    coupon: String
});
exports.orderSchema.virtual("total").get(function () {
    return _.reduce(this.orderLines, function (memo, orderLine) {
        return memo + orderLine.totalPrice;
    }, 0);
});
exports.orderSchema.method("addOrderLine", function (orderLineToAdd, cb) {
    var order = this;
    var existingOrderLineWithSameProduct = _.find(this.orderLines, function (x) { return x.productId === orderLineToAdd.productId; });
    if (existingOrderLineWithSameProduct) {
        existingOrderLineWithSameProduct.quantity += orderLineToAdd.quantity;
        existingOrderLineWithSameProduct.totalPrice += orderLineToAdd.totalPrice;
    }
    else {
        this.orderLines.push(orderLineToAdd);
    }
    var orderLineToValidate = existingOrderLineWithSameProduct || orderLineToAdd;
    Product.findById(orderLineToValidate.productId, function (err, product) {
        if (err)
            return cb(err);
        if (orderLineToValidate.quantity > product.maxQuantityInOrder) {
            return cb(new BusinessError("\u05DE\u05E7\u05E1\u05D9\u05DE\u05D5\u05DD \u05D9\u05D7\u05D9\u05D3\u05D5\u05EA \u05D1\u05D4\u05D6\u05DE\u05E0\u05D4 : " + product.maxQuantityInOrder));
        }
        order.calcRewards();
        cb(null, order);
    });
});
exports.orderSchema.method("removeLineById", function (orderLineId) {
    var order = this;
    this.orderLines.id(orderLineId).remove();
    order.calcRewards();
});
exports.orderSchema.method("markAsPaid", function (paymentInformation, cb) {
    if (cb === void 0) { cb = function () { }; }
    var order = this;
    order.paymentInformation = paymentInformation;
    order.markModified("paymentInformation");
    order.status = 1 /* paid */;
    order.paidDate = new Date();
    cb(null);
});
exports.orderSchema.method("addCoupon", function (coupon, cb) {
    var order = this;
    if (coupon.trim().toLowerCase() !== couponName.trim().toLowerCase())
        return cb(new BusinessError("קוד קופון אינו תקין"));
    if (order.total < minOrder)
        return cb(new BusinessError("\u05DE\u05D9\u05E0\u05D9\u05DE\u05D5\u05DD \u05D4\u05D6\u05DE\u05E0\u05D4 : " + minOrder));
    order.coupon = coupon;
    order.calcRewards();
    cb(null, order);
});
exports.orderSchema.method("calcRewards", function () {
    var order = this;
    if (order.total < minOrder)
        order.shipmentFee = shipmentFee;
    else
        order.shipmentFee = 0;
});
exports.orderSchema.set("toJSON", { getters: true });
exports.orderSchema.set("toObject", { getters: true });
