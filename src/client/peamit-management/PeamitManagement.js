require.config(requireConfig);
require(["angular","ui.bootstrap"
    ,"angular-route","ngResource"
    ,"../product/product-module"
    ,"../order/order-module"
    ,"../order/order-directive"
    ,"../utils/utils-module"
    ,"jQuery","underscore"
    ,"../Infra/infra-module"
    ,"../Infra/imageMaintenanceController"
    ,"ngAnimate","uiGrid","toastr","ng-file-upload",
    ,"ui.select"
    ,"blockUI"
    ,"jquery.ui"
    ,"ui.sortable"],function () {
    var app = angular.module('PeamitManagement', ['ui.bootstrap',"ui.grid","ui.grid.selection",'ngRoute','ngResource',"product","utils","infra","ngAnimate","ngFileUpload"
    ,"ui.select"
    ,"order"
    ,"ui.sortable"]);
    app.config(['$routeProvider',function ($routeProvider) {
        $routeProvider.
            when('/ProductsView', {
                templateUrl: '/ManagementViews/ProductsView.html',
                controller : "ProductsViewController",
                controllerAs : "productViewController"
            }).
            when("/ProductMaintenance/:productId?",{
                templateUrl: '/ManagementViews/ProductMaintenance.html',
                controller: 'ProductMaintenanceController'
            }).
            when('/TagsView', {
                templateUrl: '/ManagementViews/TagsView.html'
            }).
            when("/TagMaintenance/:tagId?",{
                templateUrl: '/ManagementViews/TagMaintenance.html'
            }).
            when("/ClosedOrders",{
                templateUrl: "/ManagementViews/ClosedOrders.html"
            }).
            when("/OrderMaintenance/:orderId?",{
                templateUrl: '/ManagementViews/OrderMaintenance.html'
            }).
            when("/ImageMaintenance",{
                templateUrl: '/ManagementViews/ImageMaintenance.html'
            }).
            when("/ContactRequests",{
                templateUrl: '/ManagementViews/ContactRequests.html'
            });;
    }]);

    $(function(){
        angular.bootstrap(document, ['PeamitManagement']);
    });
} );
