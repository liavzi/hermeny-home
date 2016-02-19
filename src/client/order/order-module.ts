///<reference path="../../../typings/angularjs/angular.d.ts"/>

import angular = require("angular");

export var app = angular.module("order",[]);

//Controllers
app.controller('OrderLineController', ['$scope', 'ProductResource',"myOrder",function ($scope, productResource,myOrder : MyOrder) {
    $scope.product = productResource.getById({id:$scope.orderLine.productId});
    $scope.removeOrderLine = function(){
        myOrder.removeOrderLine($scope.orderLine._id).then(function(order){
            $scope.orderModel.order = order;
            if ($scope.onOrderLineRemoved) $scope.onOrderLineRemoved();
        });
    };
} ]);
app.controller("ProductSoldModalController",["$scope","$modalInstance","$state","soldProduct",function ($scope, $modalInstance,$state,soldProduct){
    $scope.soldProduct = soldProduct;
    $scope.pay = function(){
        $modalInstance.close();
        $state.go("payment.myOrder");
    };
}]);

app.controller("closedOrdersController", ["$scope","$location","OrderResource","toastr",function ($scope,$location,orderResource,toastr) {
    var _this = this;
    this.gridOptions ={
        data : [],
        onRegisterApi : function(gridApi){
            _this.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope,function(row){
                _this.selectedOrder = row.entity;
            });
        },
        enableFullRowSelection :true,
        enableSelectionBatchEvent :false,
        multiSelect:false,
        noUnselect :true,
        columnDefs : [
            {
                field : "id",
                displayName : "מזהה"
            },
            {
                field : "status",
                displayName : "סטטוס"
            },
            {
                field : "paidDate",
                displayName : "תאריך תשלום"
            }
        ]
    };
    this.loadOrders = function(){
        this.gridOptions.data = orderResource.getAll();
    };
    this.loadOrders();
    this.editOrder = function(order){
        $location.path("/OrderMaintenance/"+order._id);
    };
    this.deleteOrder = function(order){
        orderResource.delete({orderId:order._id}).$promise.then(function(){
            toastr.success("ההזמנה נמחקה");
            _this.loadOrders();});
    };
}]);

app.controller("orderMaintenance", ["$scope","$routeParams","OrderResource",function ($scope,$routeParams,orderResource) {
    var _this = this;
    var orderId = $routeParams.orderId;
    this.order = orderResource.get({orderId:orderId});
}]);

app.directive("productForSelling",["$modal","myOrder",function($modal,myOrder : MyOrder){
    return {
        restrict : "EA",
        scope : {
            product : "="
        },
        templateUrl : "Views/productForSelling.html",
        controller : function($scope){
            $scope.product.quantity = 0;
        },
        link : function(scope){
            scope.addToCart = function(){
                var saleInfo = {productId: scope.product._id, quantity: scope.product.quantity};
                var itemSoldPromise = myOrder.addItem(saleInfo);           
                var modalInstance = $modal.open({
                    templateUrl:"Views/ProductSoldModal.html",
                    size:"lg",
                    controller : "ProductSoldModalController",
                    resolve : {
                        itemSold : function(){return itemSoldPromise;},
                        soldProduct : function(){return angular.copy(scope.product);}
                    },
                    windowClass : "product-sold-modal"
                });
                scope.product.quantity = 0;

            };
            scope.openDetails = function(){
                var modalInstance = $modal.open({
                    templateUrl:"Views/ProductDetailsModal.html",
                    size:"lg",
                    controller : ProductDetailsModalController,
                    controllerAs:"details",
                    resolve : {
                        product : function(){return scope.product;}
                    }
                    ,windowClass : "product-details-modal"
                });
                
            };
        },
        windowClass  : "center-modal"
    };
}]);

class ProductDetailsModalController{
    static $inject =["product","myOrder","$modalInstance"];
    alerts : {msg:string}[] =[];
    
    constructor(public product,private myOrder : MyOrder,private $modalInstance:ng.ui.bootstrap.IModalServiceInstance){      
    }
    
    addToCart(){
        let saleInfo = {productId: this.product._id, quantity: this.product.quantity};
        this.myOrder.addItem(saleInfo).then(()=>{
            this.alerts.push({msg:"המוצר נוסף לסל"});
        });
    }
    
    closeAlert(index) {
        this.alerts.splice(index, 1);
    };    
    
    close(){
       this.$modalInstance.dismiss(); 
    }
}



export class MyOrder{
    static $inject = ["$http"];
    constructor(private $http : ng.IHttpService){
    }
    private post(path,postdata){
        return this.$http.post("/api/myOrder/"+path,postdata).then(res=>{
            return res.data;
        });
    };
    
    public addItem(saleInfo : {productId:number,quantity:number}){
        return this.post("items",saleInfo);
    };
       
    public removeOrderLine(orderLineId){
        return this.$http.delete("/api/myOrder/lines/"+orderLineId).then(function(response){return response.data;});
    };      
    
    public getFullOrder(){
        return this.$http.get("api/myOrder").then(res=>res.data);
    }
    
    public addCoupon(coupon :string){
        return this.post("coupons",{coupon:coupon});
    }     
}

app.service("myOrder",MyOrder);

//Services

app.factory('OrderResource', ['$resource', function ($resource) {
    return $resource('/api/orders/:orderId', {id : '@_id'},
        {
            'create': { method: 'POST'},
            "getAll": {method:"GET",isArray:true}
        });
} ]);


class ContactController {
    static $inject = ["toastr","ContactCustomerRequestsResource"];
    contactRequest;
    
    constructor(private toastr : Toastr,private resource){
        this.contactRequest = {};
    }
    
    create(){
        this.resource.create(this.contactRequest).$promise.then(()=>{
           this.toastr.success("בקשתך נשמרה.אנו ניצור קשר בהקדם");
           this.contactRequest = {}; 
        });
    }
}

app.controller("Contact",ContactController)

app.factory('ContactCustomerRequestsResource', ['$resource', function ($resource) {
    return $resource('/api/contactCustomerRequests/:id', {id : '@_id'},
        {
            'create': { method: 'POST'},
            "getAll": {method:"GET",isArray:true}
        });
} ]);

class ContactRequests{
    static $inject = ["toastr","ContactCustomerRequestsResource"];
    requests : any[];
    selectedRequest :any;
    constructor(private toastr : Toastr,private resource){
        this.requests = this.resource.getAll();
    }
    
    delete(){
        this.resource.delete({id:this.selectedRequest._id}).$promise.then(()=>{
            this.toastr.success("נמחק")
            this.requests = this.resource.getAll();
        });
    }
}





app.controller("ContactRequests",ContactRequests)