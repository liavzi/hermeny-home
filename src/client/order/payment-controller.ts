/// <reference path="../../../typings/angular-ui-router/angular-ui-router.d.ts" />
import orderModule = require('./order-module');

export class CustomerDetails {
    fullName : string;
    address :string;
    phoneNumber :string;
    email : string;
}

interface IPaymentScope extends ng.IScope{
    orderModel :{order:any};
}

export class PaymentController{
    static $inject = ["$state","myOrder","toastr","$scope","$http","$sce"];

    customerDetails : CustomerDetails;
    paymentMethod : string
    paypalButton : string;
    showPaymentOptions :boolean;
    coupon :string;

    constructor(private $state : angular.ui.IStateService,private myOrder : orderModule.MyOrder,private toastr
    ,private $scope : IPaymentScope
    ,private $http : ng.IHttpService
    ,private $sce : ng.ISCEService){
        $scope.orderModel = {order  : {}};
        $scope.orderModel.order={};
        myOrder.getFullOrder().then(order=>{
            $scope.orderModel.order  =order;
        });
        this.showPaymentOptions = false;
        this.customerDetails = new CustomerDetails();
        this.$scope.$watch(()=>this.paymentMethod,(paymentMethod : string)=>{
           if (paymentMethod === "2" || paymentMethod === "1"){
               this.createPaypalButton();
           } 
           else{
               this.paypalButton = null;
           }
        });
    }
    
    pay(){
        this.showPaymentOptions = true;
        this.scrollToBottom();
    }
    
    createPaypalButton(){
        this.$http.get("/api/myOrder/paypalButton").then(result=>{
            this.paypalButton = this.$sce.trustAsHtml(result.data);          
        });
    }
    
    private scrollToBottom(){
        $('html, body').animate({scrollTop:$(document).height()}, 'slow');
    }
    
    addCoupon(){
        this.myOrder.addCoupon(this.coupon).then(order=>{
            this.$scope.orderModel.order = order;
            this.toastr.success("הקופון התקבל");
        })
    }
    
    cancelPaymentSection(){
        this.showPaymentOptions = false;
        this.paymentMethod = "";
    }

}
orderModule.app.controller("payment",PaymentController);
