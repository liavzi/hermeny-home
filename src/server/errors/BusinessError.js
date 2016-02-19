var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BusinessError = (function (_super) {
    __extends(BusinessError, _super);
    function BusinessError(message) {
        _super.call(this);
        this.name = "BusinessError";
        this.message = message;
    }
    return BusinessError;
})(Error);
module.exports = BusinessError;
