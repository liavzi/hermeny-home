///<reference path="../../../typings/tsd.d.ts" />
import _ = require("underscore");
import mongoose     = require('mongoose');
import BusinessError  = require("../errors/BusinessError");
import config = require("config");
let couponName= config.get<string>("coupon.name");
let minOrder = config.get("coupon.minOrder");
let shipmentFee = <number>config.get("order.shipmentFee");
var validator = require("validator");
var Schema       = mongoose.Schema;
import Product = require("../models/ProductModel");

var orderLineSchema = new Schema({
    productId : Number,
    quantity : {type:Number,min:1},
    totalPrice : {type:Number,min:0}
});

export const enum OrderStatus{
    open
    ,paid
}

export interface IOrder extends mongoose.Document{
    status : OrderStatus;
    markAsPaid(paymentInformation,cb?:(err:Error)=>any);
    total : number;
    paymentInformation : any;
    shipmentFee : number;
    paidDate : Date;
    coupon : string;
    addCoupon(coupon :string,cb : (err:Error,order?:IOrder)=>any);
    calcRewards();
}


export var orderSchema   = new Schema({
    orderLines : [orderLineSchema],
    customerDetails : {
        fullName : String,
        address : String,
        phoneNumber : {type : Number},
        email : {type : String ,validate : function(value){
            return validator.isEmail(value);
        }}
    },
    status : {type:Number,min:OrderStatus.open,max:OrderStatus.paid}
    ,paymentInformation : {}
    ,paidDate : Date
    ,shipmentFee : {type : Number,min:0}
    ,coupon : String
});

orderSchema.virtual("total").get(function(){
    return _.reduce(this.orderLines, function(memo, orderLine :any){
        return memo + orderLine.totalPrice;},0);
});

orderSchema.method("addOrderLine",function(orderLineToAdd,cb:Function){
    let order = <IOrder> this;
    var existingOrderLineWithSameProduct = _.find(this.orderLines,function(x :any){return x.productId===orderLineToAdd.productId;});
    if (existingOrderLineWithSameProduct){
        existingOrderLineWithSameProduct.quantity+=orderLineToAdd.quantity;
        existingOrderLineWithSameProduct.totalPrice+=orderLineToAdd.totalPrice;
    }
    else{
        this.orderLines.push(orderLineToAdd);        
    }  
    let orderLineToValidate = existingOrderLineWithSameProduct || orderLineToAdd;
    Product.findById(orderLineToValidate.productId,(err,product : any)=>{
        if (err) return cb(err);
        if (orderLineToValidate.quantity > product.maxQuantityInOrder){
            return cb(new BusinessError(`מקסימום יחידות בהזמנה : ${product.maxQuantityInOrder}`));
        }
        order.calcRewards();
        cb(null,order);
    }); 
});

orderSchema.method("removeLineById",function(orderLineId){
    let order = <IOrder> this;
    this.orderLines.id(orderLineId).remove();
    order.calcRewards();
});

orderSchema.method("markAsPaid",function(paymentInformation,cb :Function = ()=>{} ){
    let order = <IOrder> this;
    order.paymentInformation = paymentInformation;
    order.markModified("paymentInformation");
    order.status = OrderStatus.paid;
    order.paidDate = new Date();
    cb(null);
});

orderSchema.method("addCoupon",function(coupon:string,cb :(err:Error,order?:IOrder)=>any){    
    let order = <IOrder> this;
    if (coupon.trim().toLowerCase() !== couponName.trim().toLowerCase()) return cb(new BusinessError("קוד קופון אינו תקין"));
    if (order.total<minOrder) return cb(new BusinessError(`מינימום הזמנה : ${minOrder}`));
    order.coupon = coupon;
    order.calcRewards();
    cb(null,order);
});

orderSchema.method("calcRewards",function(){
    let order = <IOrder> this;
    if (order.total<minOrder)
        order.shipmentFee = shipmentFee;
    else
        order.shipmentFee = 0;
});


orderSchema.set("toJSON",{getters:true});
orderSchema.set("toObject",{getters:true});