///<reference path="../../../typings/angularjs/angular.d.ts"/>
define(["require", "exports", "angular"], function (require, exports, angular) {
    exports.app = angular.module("order", []);
    //Controllers
    exports.app.controller('OrderLineController', ['$scope', 'ProductResource', "myOrder", function ($scope, productResource, myOrder) {
            $scope.product = productResource.getById({ id: $scope.orderLine.productId });
            $scope.removeOrderLine = function () {
                myOrder.removeOrderLine($scope.orderLine._id).then(function (order) {
                    $scope.orderModel.order = order;
                    if ($scope.onOrderLineRemoved)
                        $scope.onOrderLineRemoved();
                });
            };
        }]);
    exports.app.controller("ProductSoldModalController", ["$scope", "$modalInstance", "$state", "soldProduct", function ($scope, $modalInstance, $state, soldProduct) {
            $scope.soldProduct = soldProduct;
            $scope.pay = function () {
                $modalInstance.close();
                $state.go("payment.myOrder");
            };
        }]);
    exports.app.controller("closedOrdersController", ["$scope", "$location", "OrderResource", "toastr", function ($scope, $location, orderResource, toastr) {
            var _this = this;
            this.gridOptions = {
                data: [],
                onRegisterApi: function (gridApi) {
                    _this.gridApi = gridApi;
                    gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                        _this.selectedOrder = row.entity;
                    });
                },
                enableFullRowSelection: true,
                enableSelectionBatchEvent: false,
                multiSelect: false,
                noUnselect: true,
                columnDefs: [
                    {
                        field: "id",
                        displayName: "מזהה"
                    },
                    {
                        field: "status",
                        displayName: "סטטוס"
                    },
                    {
                        field: "paidDate",
                        displayName: "תאריך תשלום"
                    }
                ]
            };
            this.loadOrders = function () {
                this.gridOptions.data = orderResource.getAll();
            };
            this.loadOrders();
            this.editOrder = function (order) {
                $location.path("/OrderMaintenance/" + order._id);
            };
            this.deleteOrder = function (order) {
                orderResource.delete({ orderId: order._id }).$promise.then(function () {
                    toastr.success("ההזמנה נמחקה");
                    _this.loadOrders();
                });
            };
        }]);
    exports.app.controller("orderMaintenance", ["$scope", "$routeParams", "OrderResource", function ($scope, $routeParams, orderResource) {
            var _this = this;
            var orderId = $routeParams.orderId;
            this.order = orderResource.get({ orderId: orderId });
        }]);
    exports.app.directive("productForSelling", ["$modal", "myOrder", function ($modal, myOrder) {
            return {
                restrict: "EA",
                scope: {
                    product: "="
                },
                templateUrl: "Views/productForSelling.html",
                controller: function ($scope) {
                    $scope.product.quantity = 0;
                },
                link: function (scope) {
                    scope.addToCart = function () {
                        var saleInfo = { productId: scope.product._id, quantity: scope.product.quantity };
                        var itemSoldPromise = myOrder.addItem(saleInfo);
                        var modalInstance = $modal.open({
                            templateUrl: "Views/ProductSoldModal.html",
                            size: "lg",
                            controller: "ProductSoldModalController",
                            resolve: {
                                itemSold: function () { return itemSoldPromise; },
                                soldProduct: function () { return angular.copy(scope.product); }
                            },
                            windowClass: "product-sold-modal"
                        });
                        scope.product.quantity = 0;
                    };
                    scope.openDetails = function () {
                        var modalInstance = $modal.open({
                            templateUrl: "Views/ProductDetailsModal.html",
                            size: "lg",
                            controller: ProductDetailsModalController,
                            controllerAs: "details",
                            resolve: {
                                product: function () { return scope.product; }
                            },
                            windowClass: "product-details-modal"
                        });
                    };
                },
                windowClass: "center-modal"
            };
        }]);
    var ProductDetailsModalController = (function () {
        function ProductDetailsModalController(product, myOrder, $modalInstance) {
            this.product = product;
            this.myOrder = myOrder;
            this.$modalInstance = $modalInstance;
            this.alerts = [];
        }
        ProductDetailsModalController.prototype.addToCart = function () {
            var _this = this;
            var saleInfo = { productId: this.product._id, quantity: this.product.quantity };
            this.myOrder.addItem(saleInfo).then(function () {
                _this.alerts.push({ msg: "המוצר נוסף לסל" });
            });
        };
        ProductDetailsModalController.prototype.closeAlert = function (index) {
            this.alerts.splice(index, 1);
        };
        ;
        ProductDetailsModalController.prototype.close = function () {
            this.$modalInstance.dismiss();
        };
        ProductDetailsModalController.$inject = ["product", "myOrder", "$modalInstance"];
        return ProductDetailsModalController;
    })();
    var MyOrder = (function () {
        function MyOrder($http) {
            this.$http = $http;
        }
        MyOrder.prototype.post = function (path, postdata) {
            return this.$http.post("/api/myOrder/" + path, postdata).then(function (res) {
                return res.data;
            });
        };
        ;
        MyOrder.prototype.addItem = function (saleInfo) {
            return this.post("items", saleInfo);
        };
        ;
        MyOrder.prototype.removeOrderLine = function (orderLineId) {
            return this.$http.delete("/api/myOrder/lines/" + orderLineId).then(function (response) { return response.data; });
        };
        ;
        MyOrder.prototype.getFullOrder = function () {
            return this.$http.get("api/myOrder").then(function (res) { return res.data; });
        };
        MyOrder.prototype.addCoupon = function (coupon) {
            return this.post("coupons", { coupon: coupon });
        };
        MyOrder.$inject = ["$http"];
        return MyOrder;
    })();
    exports.MyOrder = MyOrder;
    exports.app.service("myOrder", MyOrder);
    //Services
    exports.app.factory('OrderResource', ['$resource', function ($resource) {
            return $resource('/api/orders/:orderId', { id: '@_id' }, {
                'create': { method: 'POST' },
                "getAll": { method: "GET", isArray: true }
            });
        }]);
    var ContactController = (function () {
        function ContactController(toastr, resource) {
            this.toastr = toastr;
            this.resource = resource;
            this.contactRequest = {};
        }
        ContactController.prototype.create = function () {
            var _this = this;
            this.resource.create(this.contactRequest).$promise.then(function () {
                _this.toastr.success("בקשתך נשמרה.אנו ניצור קשר בהקדם");
                _this.contactRequest = {};
            });
        };
        ContactController.$inject = ["toastr", "ContactCustomerRequestsResource"];
        return ContactController;
    })();
    exports.app.controller("Contact", ContactController);
    exports.app.factory('ContactCustomerRequestsResource', ['$resource', function ($resource) {
            return $resource('/api/contactCustomerRequests/:id', { id: '@_id' }, {
                'create': { method: 'POST' },
                "getAll": { method: "GET", isArray: true }
            });
        }]);
    var ContactRequests = (function () {
        function ContactRequests(toastr, resource) {
            this.toastr = toastr;
            this.resource = resource;
            this.requests = this.resource.getAll();
        }
        ContactRequests.prototype.delete = function () {
            var _this = this;
            this.resource.delete({ id: this.selectedRequest._id }).$promise.then(function () {
                _this.toastr.success("נמחק");
                _this.requests = _this.resource.getAll();
            });
        };
        ContactRequests.$inject = ["toastr", "ContactCustomerRequestsResource"];
        return ContactRequests;
    })();
    exports.app.controller("ContactRequests", ContactRequests);
});
