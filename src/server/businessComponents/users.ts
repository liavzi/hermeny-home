import express = require("express");
import _  = require("underscore");

export interface IUser{
    _id : number;
    googleProfileId :string;
    isAdmin : boolean;    
}

class UserRepository{
    static users :IUser[]= [{
        _id: 1,
        googleProfileId : "102414180728342095926",
        isAdmin : true
    }];
    getByGoogleProfileId(googleProfileId :string,cb :Function){
        return cb(null,_.find(UserRepository.users,x=>x.googleProfileId === googleProfileId));
    }
    getById(userId : number,cb :Function){
        return cb(null,_.find(UserRepository.users,x=>x._id === userId));
    }
}

export function ensureAdminOrRedirectToLogin(req : express.Request, res :express.Response, next) {
    if (isAdmin(req)) return next();
    res.redirect("/Views/managementLogin.html");
}

function isAdmin(req : express.Request){
    if (req.isAuthenticated() && (<IUser> req.user).isAdmin)
        return true;
    return false;
}

export function ensureAdmin(req : express.Request,res :express.Response,next){
    if(isAdmin(req)) return next();
    res.status(401).end();
}

export let userRepository  = new UserRepository();



