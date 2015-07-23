var http = require('http');
var express = require('express');
module.exports = function(port,role,next){
  var server = new http.Server();
  var app = express();
  app.get('/are-you-here',function(req,res){
    res.status(200).end(role);
  });
  server.once("error",next);
  server.listen(port,function(){
    server.removeListener("error",next);
    server.on('request',app);
    next(void 0,server);
  });
};
