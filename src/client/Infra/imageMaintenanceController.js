define(["require", "exports", "./infra-module"], function (require, exports, infra) {
    var app = infra.app;
    var ImageMaintenance = (function () {
        function ImageMaintenance(Upload, toastr, imageResource) {
            this.Upload = Upload;
            this.toastr = toastr;
            this.imageResource = imageResource;
            this.loadImages();
        }
        ImageMaintenance.prototype.loadImages = function () {
            this.images = this.imageResource.getAll();
        };
        ImageMaintenance.prototype.uploadFiles = function () {
            var _this = this;
            if (this.files && this.files.length) {
                // for (var i = 0; i < this.files.length; i++) {
                //   this.Upload.upload({..., data: {file: files[i]}, ...})...;
                // }
                // or send them all together for HTML5 browsers:
                this.Upload.upload({ url: "/api/images", data: { file: this.files } }).then(function () {
                    _this.toastr.success("התמונות נשמרו");
                    _this.loadImages();
                });
            }
        };
        ImageMaintenance.prototype.deleteImage = function (image) {
            var _this = this;
            this.imageResource.delete(image._id).then(function () {
                _this.loadImages();
            });
        };
        ImageMaintenance.$inject = ["Upload", "toastr", "imageResource"];
        return ImageMaintenance;
    })();
    app.controller("imageMaintenance", ImageMaintenance);
    app.factory('imageResource', ['peamitResource', function (peamitResource) {
            return peamitResource("images");
        }]);
});
