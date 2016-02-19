define(["require", "exports", "angular", "toastr"], function (require, exports, angular, toastr) {
    exports.app = angular.module("infra", ["ngResource"]);
    exports.app.config(["$httpProvider", "$provide", function ($httpProvider, $provide) {
            $httpProvider.interceptors.push("blockUiInterceptorFactory", "validationErrorInterceptorFactory", "noCacheInterceptorFactory");
            $provide.decorator("$exceptionHandler", ["$delegate", "$injector", function ($delegate, $injector) {
                    return function (exception, cause) {
                        var toastr = $injector.get("toastr");
                        toastr.error("אירעה שגיאה. אנא נסה שוב");
                        $delegate(exception, cause);
                    };
                }]);
        }]);
    function validationErrorInterceptorFactory(toastr, $q, $exceptionHandler) {
        function formatError(err) {
            var msgs = [];
            Object.keys(err.errors).forEach(function (key) {
                if (this == this.errors[key])
                    return;
                msgs.push(String(this.errors[key].message));
            }, err);
            return msgs.join(String.fromCharCode(13, 10));
        }
        return {
            responseError: function (response) {
                if (response.status && response.status === 400) {
                    var error = response.data;
                    if (error.name === "ValidationError") {
                        toastr.error(formatError(error));
                    }
                    else if (error.name === "BusinessError") {
                        toastr.error(error.message);
                    }
                }
                else if (response.status === 0 || response.status === 500) {
                    $exceptionHandler(new Error("error when sending request to the server. status code " + response.status));
                }
                return $q.reject(response);
            }
        };
    }
    validationErrorInterceptorFactory.$inject = ["toastr", "$q", "$exceptionHandler"];
    exports.app.factory("validationErrorInterceptorFactory", validationErrorInterceptorFactory);
    function blockUiInterceptorFactory($templateCache, $q) {
        var requestsCount = 0;
        var options = {
            message: "\n        <div class=''>\n            <svg width=\"80px\" height=\"80px\" viewBox=\"0 0 80 80\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:sketch=\"http://www.bohemiancoding.com/sketch/ns\">\n                <defs>\n                    <style>\n                        .blue{\n                            fill: #0072cf;\n                        }\n            \n                    </style>\n                </defs>\n            \n                <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\" sketch:type=\"MSPage\">\n                    <g id=\"Group-3\" sketch:type=\"MSLayerGrosup\" fill=\"#4990E2\">\n                        <path class=\"blue\"\n                    id=\"spinner\" \n                    d=\"M40,72C22.4,72,8,57.6,8,40C8,22.4,\n                    22.4,8,40,8c17.6,0,32,14.4,32,32c0,1.1-0.9,2-2,2\n                    s-2-0.9-2-2c0-15.4-12.6-28-28-28S12,24.6,12,40s12.6,\n                    28,28,28c1.1,0,2,0.9,2,2S41.1,72,40,72z\"/>\n                    </g>\n                    <animateTransform\n                        attributeType=\"xml\"\n                        attributeName=\"transform\"\n                        type=\"rotate\"\n                        from=\"0 40 40\"\n                        to=\"360 40 40\"\n                        dur=\"0.8s\"\n                        repeatCount=\"indefinite\"\n                    />\n                </g>\n            </svg>\n        </div>",
            css: {
                border: "none",
                backgroundColor: "none"
            },
            overlayCSS: {
                backgroundColor: "transparent"
            }
        };
        return {
            request: function (config) {
                if (requestsCount++ === 0)
                    $.blockUI(options);
                return config;
            },
            response: function (response) {
                if (--requestsCount === 0)
                    $.unblockUI();
                return response;
            },
            responseError: function (response) {
                if (--requestsCount === 0)
                    $.unblockUI();
                return $q.reject(response);
            }
        };
    }
    blockUiInterceptorFactory.$inject = ["$templateCache", "$q"];
    exports.app.factory("blockUiInterceptorFactory", blockUiInterceptorFactory);
    function noCacheInterceptorFactory($templateCache) {
        return {
            request: function (config) {
                if (config.method == 'GET' && !endsWith(config.url, ".html") && !$templateCache.get(config.url)) {
                    var separator = config.url.indexOf('?') === -1 ? '?' : '&';
                    config.url = config.url + separator + 'noCache=' + new Date().getTime();
                }
                return config;
            }
        };
        function endsWith(str, suffix) {
            return str.indexOf(suffix, str.length - suffix.length) !== -1;
        }
    }
    noCacheInterceptorFactory.$inject = ["$templateCache"];
    exports.app.factory("noCacheInterceptorFactory", noCacheInterceptorFactory);
    exports.app.factory("peamitResource", ["$resource", "toastr", function ($resource, toastr) {
            function addSavedAlert() {
                toastr.success("נשמר");
            }
            function addDeletedAlert() {
                toastr.success("נמחק");
            }
            function addFailedAlert() {
                toastr.error("נכשל");
            }
            return function (path) {
                var innerReource = $resource("/api/" + path + "/:id", { id: "@_id" }, {
                    'post': { method: "POST" },
                    'put': { method: 'PUT' },
                    'getAll': { method: 'GET', isArray: true },
                    "getById": { method: "GET" }
                });
                var peamitResource = Object.create(innerReource);
                peamitResource.put = function (entity) {
                    return innerReource.put(entity).$promise.then(addSavedAlert, addFailedAlert);
                };
                peamitResource.delete = function (id) {
                    return innerReource.delete({ id: id }).$promise.then(addDeletedAlert, addFailedAlert);
                };
                return peamitResource;
            };
        }]);
    var Toaster = (function () {
        function Toaster() {
        }
        Toaster.prototype.success = function (message) {
            toastr.success(message);
        };
        Toaster.prototype.error = function (message) {
            toastr.error(message);
        };
        return Toaster;
    })();
    exports.Toaster = Toaster;
    exports.app.service("toastr", Toaster);
    exports.app.filter("asTrusted", ['$sce', function ($sce) {
            return function (htmlCode) {
                return $sce.trustAsHtml(htmlCode);
            };
        }]);
    /**
     * AngularJS default filter with the following expression:
     * "person in people | filter: {name: $select.search, age: $select.search}"
     * performs a AND between 'name: $select.search' and 'age: $select.search'.
     * We want to perform a OR.
     */
    exports.app.filter('orFilter', function () {
        return function (items, props) {
            var out = [];
            if (angular.isArray(items)) {
                items.forEach(function (item) {
                    var itemMatches = false;
                    var keys = Object.keys(props);
                    for (var i = 0; i < keys.length; i++) {
                        var prop = keys[i];
                        var text = props[prop].toLowerCase();
                        if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                            itemMatches = true;
                            break;
                        }
                    }
                    if (itemMatches) {
                        out.push(item);
                    }
                });
            }
            else {
                // Let the output be the input untouched
                out = items;
            }
            return out;
        };
    });
});
