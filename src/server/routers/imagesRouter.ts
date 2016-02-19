///<reference path="../../../typings/tsd.d.ts" />
import express = require("express");
import multer = require("multer");
import fs = require("fs");
import schemas = require("schemas");
import _ = require("underscore");
import path = require("path");
import users = require("../businessComponents/users");
let imagesRouter = express.Router();
let imagesDirPath = `${__dirname}/../../client/resources/images`;	
let storage = (<any>multer).diskStorage({
	destination: function (req, file, cb) {
		cb(null, imagesDirPath)
	},
	filename: function (req, file, cb) {

		// var getFileExt = function(fileName){
		// 	var fileExt = fileName.split(".");
		// 	if( fileExt.length === 1 || ( fileExt[0] === "" && fileExt.length === 2 ) ) {
		// 		return "";
		// 	}
		// 	return fileExt.pop();
		// }
		cb(null,file.originalname);
	}
})
let upload =(<any> multer(<any>{
		storage : storage
	})).array("file[0]",500);
	
	
imagesRouter.route("/images")
	.post(users.ensureAdmin,upload,function(req,res,next){
		res.status(200);
		res.end();
	})
	.get(users.ensureAdmin,function(req,res,next){
		fs.readdir(imagesDirPath,(err,fileNames)=>{
			if (err) return next(err);
			let images : schemas.Image[] = _.map(fileNames,(fileName)=>{
				return {
					_id :fileName,
					imageUrl : `/resources/images/${fileName}`
				};
			});
			res.json(images);
			//res.end();		
		})
	})
imagesRouter.route("/images/:imageId")
	.delete(users.ensureAdmin,(req,res,next)=>{
		fs.unlink(path.resolve(imagesDirPath,req.params.imageId),(err)=>{
			if (err) return err;
			res.status(200).end();
		})
	});


export = imagesRouter;