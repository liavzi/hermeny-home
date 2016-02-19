///<reference path="../../../typings/tsd.d.ts" />
var express = require("express");
var multer = require("multer");
var fs = require("fs");
var _ = require("underscore");
var path = require("path");
var users = require("../businessComponents/users");
var imagesRouter = express.Router();
var imagesDirPath = __dirname + "/../../client/resources/images";
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, imagesDirPath);
    },
    filename: function (req, file, cb) {
        // var getFileExt = function(fileName){
        // 	var fileExt = fileName.split(".");
        // 	if( fileExt.length === 1 || ( fileExt[0] === "" && fileExt.length === 2 ) ) {
        // 		return "";
        // 	}
        // 	return fileExt.pop();
        // }
        cb(null, file.originalname);
    }
});
var upload = multer({
    storage: storage
}).array("file[0]", 500);
imagesRouter.route("/images")
    .post(users.ensureAdmin, upload, function (req, res, next) {
    res.status(200);
    res.end();
})
    .get(users.ensureAdmin, function (req, res, next) {
    fs.readdir(imagesDirPath, function (err, fileNames) {
        if (err)
            return next(err);
        var images = _.map(fileNames, function (fileName) {
            return {
                _id: fileName,
                imageUrl: "/resources/images/" + fileName
            };
        });
        res.json(images);
        //res.end();		
    });
});
imagesRouter.route("/images/:imageId")
    .delete(users.ensureAdmin, function (req, res, next) {
    fs.unlink(path.resolve(imagesDirPath, req.params.imageId), function (err) {
        if (err)
            return err;
        res.status(200).end();
    });
});
module.exports = imagesRouter;
