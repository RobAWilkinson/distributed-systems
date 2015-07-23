
var config = require('getconfig');
var utils = require('../utils.js');
var http =  require('http');

module.exports = utils.asyncCachable(function(next){
  var server = http.Server();
  server.on('error', next);
  server.listen(config.http.port,config.http.host,function(){
    server.removeListener('error',next);
    console.log("HTTP listening on http://"+config.http.host+":"+config.http.port);
    next(void 0, server);
  });
});