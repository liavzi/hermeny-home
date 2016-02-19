///<reference path="../../typings/tsd.d.ts" />
import path = require("path");
process.env.NODE_CONFIG_DIR = path.join(__dirname,"config");
import users = require("./businessComponents/users");
var express    = require('express'); 		// call express
var app        = express(); 				// define our app using express
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var registerRoutes = require("./routers/registerRouters");

var databaseConfig = require("./config/databaseConfig.json");
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var MongoStore = require('connect-mongo')(session);
import config = require("config");
console.log(config.get("test"));



if(process.env.OPENSHIFT_MONGODB_DB_URL){
    let mongodb_connection_string = process.env.OPENSHIFT_MONGODB_DB_URL + "node";
    mongoose.connect(mongodb_connection_string);
}
else{
    mongoose.connect(databaseConfig.url);   
}



passport.use(new GoogleStrategy({
        clientID: config.get("passport.google.clientID"),
        clientSecret: config.get("passport.google.clientSecret"),
        callbackURL: config.get("passport.google.callbackURL")
    },
    function(accessToken, refreshToken, profile, done) {
        users.userRepository.getByGoogleProfileId(profile.id,(err,user : users.IUser)=>{
            if (err) return done(err);
            if (user) return done(null,user);
            done(null,false);
        });
    }
));

app.use(session({
    secret: config.get("session.secret"),
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use("/ManagementViews",users.ensureAdminOrRedirectToLogin);
app.use(express.static(path.join(__dirname,"../client")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


passport.serializeUser(function(user : users.IUser, done) {
    done(null, user._id);
});

passport.deserializeUser(function(obj, done) {
    users.userRepository.getById(obj,(err,user :users.IUser)=>{
       if (err) return done(err);
       done(null,user); 
    });
});

// Redirect the user to Google for authentication.  When complete, Google
// will redirect the user back to the application at
//     /auth/google/return
app.get('/auth/google', passport.authenticate('google',{scope : ["email"]}));


// Google will redirect the user to this URL after authentication.  Finish
// the process by verifying the assertion.  If valid, the user will be
// logged in.  Otherwise, authentication has failed.
app.get('/auth/google/callback',passport.authenticate('google', {
    successRedirect: '/ManagementViews',
    failureRedirect: '/Views/managementLogin.html' }));







var port = process.env.OPENSHIFT_NODEJS_PORT || 8080; 		// set our port
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
app.set('port', port);
app.set('ip', server_ip_address);

registerRoutes(express,app);

// START THE SERVER
// =============================================================================
app.listen(app.get('port') ,app.get('ip'));
console.log('Magic happens on port ' + port);
