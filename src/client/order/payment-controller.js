define(["require", "exports", './order-module'], function (require, exports, orderModule) {
    var CustomerDetails = (function () {
        function CustomerDetails() {
        }
        return CustomerDetails;
    })();
    exports.CustomerDetails = CustomerDetails;
    var PaymentController = (function () {
        function PaymentController($state, myOrder, toastr, $scope, $http, $sce) {
            var _this = this;
            this.$state = $state;
            this.myOrder = myOrder;
            this.toastr = toastr;
            this.$scope = $scope;
            this.$http = $http;
            this.$sce = $sce;
            $scope.orderModel = { order: {} };
            $scope.orderModel.order = {};
            myOrder.getFullOrder().then(function (order) {
                $scope.orderModel.order = order;
            });
            this.showPaymentOptions = false;
            this.customerDetails = new CustomerDetails();
            this.$scope.$watch(function () { return _this.paymentMethod; }, function (paymentMethod) {
                if (paymentMethod === "2" || paymentMethod === "1") {
                    _this.createPaypalButton();
                }
                else {
                    _this.paypalButton = null;
                }
            });
        }
        PaymentController.prototype.pay = function () {
            this.showPaymentOptions = true;
            this.scrollToBottom();
        };
        PaymentController.prototype.createPaypalButton = function () {
            var _this = this;
            this.$http.get("/api/myOrder/paypalButton").then(function (result) {
                _this.paypalButton = _this.$sce.trustAsHtml(result.data);
            });
        };
        PaymentController.prototype.scrollToBottom = function () {
            $('html, body').animate({ scrollTop: $(document).height() }, 'slow');
        };
        PaymentController.prototype.addCoupon = function () {
            var _this = this;
            this.myOrder.addCoupon(this.coupon).then(function (order) {
                _this.$scope.orderModel.order = order;
                _this.toastr.success("הקופון התקבל");
            });
        };
        PaymentController.prototype.cancelPaymentSection = function () {
            this.showPaymentOptions = false;
            this.paymentMethod = "";
        };
        PaymentController.$inject = ["$state", "myOrder", "toastr", "$scope", "$http", "$sce"];
        return PaymentController;
    })();
    exports.PaymentController = PaymentController;
    orderModule.app.controller("payment", PaymentController);
});
