///<reference path="../../../typings/tsd.d.ts" />
import express = require("express");

var validationErrorHandler = function(err:any,req,res : express.Response,next :Function){
    if (err instanceof Error && (err.name==="ValidationError" || err.name==="BusinessError"))
    {   
        if (((<Error>err).name ==="ValidationError")) {
            err.message = err.toString();           
        }  
        return res.json(400,err);
    }
    next(err);
};

export =validationErrorHandler;

