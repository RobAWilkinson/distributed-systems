
var utils = require('../utils.js');
var Router = require("./http-req-res");
var cookieParser = require('cookie-parser');
var User = require("./user");
var passport = require('passport');
var session = require('express-session');
var config = require('getconfig');


module.exports = utils.asyncCachable(function(next){
  var endsWithHost = new RegExp(process.env.DOMAIN_NAME.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&")+'$');
  Router(function(e,router){
    if(e) return next(e);
    User(function(e,user){
      if(e) return next(e);
      router
      .use(function(req,res,next){
        console.log(req.headers);
        next();
      })
      .use(cookieParser())
      .use(function(req,res,next){
        console.log("passed cookie parser ",req.cookies);
        next();
      }).use(function(req,res,next){
        if(!endsWithHost.test(req.hostname)) return next(new Error('bad host: ',req.hostname));
        next();
      }).use(function(req,res,next){
        console.log("good host");
        next();
      }).use(session({
          store: user.store,
          secret: user.getSecret(),
          cookie: {
              path: '/',
              domain: '.'+process.env.DOMAIN_NAME,
              maxAge: 1000 * 60 * 24 // 24 hours
          },
          resave: false,
          saveUninitialized: false
      })).use(function(req,res,next){
        console.log("session",req.session);
        next();
      }).use(passport.initialize()).use(function(req,res,next){
        console.log("passport initialize");
        next();
      })
      .use(passport.session()).use(function(req,res,next){
        console.log("passport session");
        next();
      })
      .use(function(req,res,next){
        if(req.user) return next();
        if(!req.headers.authorization) return next();
        console.log("basic");
        passport.authenticate('basic', { session: false })(req,res,next);
      }).use(function(req,res,next){
        console.log("basic");
        next();
      }).use(function(req,res,next){
        if(!req.user) return next();
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
        next();
      }).use(function(req,res,next){
        console.log("cors");
        next();
      });
      next(void 0,router);
    });
  });
});
