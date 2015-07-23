var config = require('getconfig');
var utils = require('../utils.js');
var passport = require('passport');
var MongoDB = require('./mongodb-database');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var uDir = __root+'/User';
var User = require(uDir+'/models/User');
var fs = require('fs');


module.exports = utils.asyncCachable(function(next){
  MongoDB(function(e,mongoose){
    if(e) return next(e);
    fs.readdir(uDir+"/providers",function(e,providers){
      if(e) return next(e);
      if(providers.indexOf('basic') !== -1 || providers.indexOf('basic.js') !== -1 ){
        if(!('basic' in passport._strategies)){
          try{
            passport.use('basic',require(uDir+'/providers/basic'));
          }catch(err){
            return next(err);
          }
        }
      }

      //allows the user to be stored in a cookie to be retrieved later
      passport.serializeUser(function(user, done){
          // TODO: query against database or cache these
          done(null, user._id);
      });

      // id here is returned from checking the sessionID in our session store (it has the id stored as its value)
      passport.deserializeUser(function(id, done){
          // Query databsae/cache here
          User.findOne({_id:id},function(err,user){
            if(err) return done(err);
            //We don't want to emit an error since this will prevent everything
            if(!user) return done();
            done(void(0),user);
          });
      });

      next(void 0,{
        getSecret: function(){
          return config.user.session_secret;
        },
        store: new MongoStore({ mongooseConnection: mongoose.connection })
      });
    });
  });
});

