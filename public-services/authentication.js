

var utils = require('../utils.js');
var AuthRouter = require('../micro-services/http-authentic-req-res');
module.exports = utils.asyncCachable(function(next){
  // ties apikey with user
  AuthRouter(function(e,router){
    if(e) return next(e);
    var userRouter = require('../../User/router');
    router.use(function(req,res,next){
      next();
    }).use(userRouter)
    .get("/",function(req,res,next){
      console.log("index",req.user);
      if(!req.user) return res.redirect("/login");
      next();
    });
    next();
  });
});