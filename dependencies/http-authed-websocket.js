
var utils = require('../utils.js');
var IO = require("../micro-services/http-socket");
var cookieParser = require('cookie-parser');
var User = require("./user");
var passportSocketIo = require('passport.socketio');
var config = require('getconfig');

module.exports = utils.asyncCachable(function(next){
  IO(function(e,io){
    if(e) return next(e);
    User(function(e,user){
      if(e) return next(e);
      io.use(passportSocketIo.authorize({
        secret: user.session_secret,
        resave: false,
        cookie: {
          path: '/',
          domain: '.'+process.env.DOMAIN_NAME,
          maxAge: 1000 * 60 * 24 // 24 hours
        },
        saveUninitialized: false,
        store: user.store,
        cookieParser: cookieParser
      }));
      io.use(function(socket,next){
        console.log("end middleware");
        if(socket.request.user){
          console.log("have user: ",socket.request.user);
          return next();
        }
        user.strategy('basic').fromToken(socket.request,function(err,user){
          if(err) return next(err);
          //If undefined, it doesn't matter
          socket.request.user = user;
          next();
        });
      });
      next(void 0,io);
    });
  });
});
