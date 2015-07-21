var express = require("express");

module.exports = function(server,next){
  var app = express();
  server.on("request",app);
  next(void 0, next);
};