var config = require('getconfig');
var utils = require('../utils.js');
var Server = require('./http-server');
var express = require("express");

/*
  Can also use a load balancer
*/

module.exports = utils.asyncCachable(function(next){
  Server(function(e,server){
    if(e) return next(e);
    var app = express();
    app.get('/healthcheck',function(req,res){
      res.status(200).end('ok');
    });
    server.on('request',app);
    next(void 0,app);
  });
});
