require.config(requireConfig);
require(["angular","ui.bootstrap","ngResource","../product/product-module"
    ,"../utils/utils-module"
    ,"../order/order-module"
    ,"../order/order-directive"
    ,"../order/payment-controller"
    ,"jQuery","underscore","toastr"
    ,"../Infra/infra-module","ngAnimate",
    "ui.router"
    ,"blockUI"],function () {
    var app = angular.module('Peamit', ['ui.bootstrap','ngResource',"order","product","infra","ngAnimate","ui.router"]);
    app.config(['$stateProvider',"$urlRouterProvider",function ($stateProvider,$urlRouterProvider) {
        $urlRouterProvider.otherwise("/");
        $stateProvider.
            state('home',{
                url : "/",
                views:{
                    "main-view" : {templateUrl: 'Views/Catalog.html',controller: 'CatalogController'}
                }
            }).
            state('catalog', {
                url:"/catalog",
                views:{
                    "main-view" : {templateUrl: 'Views/Catalog.html',controller: 'CatalogController'}
                }
            }).
            state('productsByTagBase', {
                abstract : true,
                views:{
                    "main-view" : {templateUrl: 'Views/ProductByTag.html'}
                }
            }).
            state('productsByTag', {
                parent : "productsByTagBase",
                url:"/productsByTag/:tagId",
                views:{
                    "products" : {templateUrl: 'Views/ProductByTagProducts.html',controller: 'ProductByTagController'}
                }
            }).
            state("contact",{
                url:"/contact",
                views:{
                    "main-view" : {templateUrl: 'Views/Contact.html',controller : "Contact as contact"}
                }
            }).
            state("delivery",{
                url:"/delivery",
                views:{
                    "main-view" : {templateUrl: 'Views/Delivery.html'}
                }
            }).
            state("about",{
                url:"/about",
                views:{
                    "main-view" : {templateUrl: 'Views/About.html'}
                }
            }).
            state("payment",{
                abstract : true,
                url:"/payment",
                views:{
                    "main-view" : {templateUrl: 'Views/Payment.html',controller : "payment as payment"}
                }
            }).
            state('payment.myOrder', {
                url:"/myOrder",
                templateUrl: 'Views/MyOrder.html',
            }). 
            state('afterPayPalSuccess', {
                url:"/afterPayPalSuccess",
                views:{
                    "main-view" : {templateUrl: 'Views/afterPayPalSuccess.html'}
                }  
            });
    }]);

    $(function(){
        angular.bootstrap(document, ['Peamit']);
    });
});