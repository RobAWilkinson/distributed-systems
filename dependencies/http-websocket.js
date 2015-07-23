
var config = require('getconfig');
var utils = require('../utils.js');
var HttpServer = require('./http-server');
var SIO = require("socket.io");

module.exports = utils.asyncCachable(function(next){
  HttpServer(function(e,server){
    if(e) return next(e);
    var io = SIO(server);
    console.log("live."+process.env.DOMAIN_NAME+":*");
    io.set('origins', "*:*");
//    io.adapter(broadcaster({ pubClient: redisee, subClient: redisee }));
//        user.middleware.ws.forEach(io.use.bind(io));
    next(void 0, io);
  });
});