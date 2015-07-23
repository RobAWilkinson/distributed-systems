var config = require('getconfig');
var redis = require('redis');
var utils = require('../utils.js');

module.exports = utils.asyncCachable(function(next){
  var c = redis.createClient(config.redis.port,config.redis.host,config.redis.options);
  var el, rl;
  c.once('error',el=function(e){
    c.removeListener('ready',rl);
    next(e);
  });
  c.once('ready',rl=function(e){
    c.removeListener('error',el);
    if(!config.redis.password) return next(void 0,c);
    c.auth(config.redis.password,function(e){
      if(e) return next(e);
      next(void 0,c);
    });
  });
});
