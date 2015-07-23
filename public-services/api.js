
var fs = require("fs");
var async = require("async");
var path = require("path");
var MongoDB = require('../micro-services/mongodb-database');
var AuthRouter = require('../micro-services/http-authentic-req-res');
var RedisEE = require('../micro-services/redis-ee');
var glob = require('glob');
var utils = require('../utils.js');


module.exports = utils.asyncCachable(function(next){
  RedisEE(function(e,redisee){
    if(e) return next(e);
    MongoDB(function(e,db){
      if(e) return next(e);
      db.plugin(function(schema){
        schema.pre('save', function(next){
          console.log("pre save: "+this.isNew);
          this.wasNew = this.isNew;
          next();
        });
      });
      //Integrate with redis
      db.plugin(function(schema){
        schema.post('save', function(doc){
          console.log("post save: "+this.wasNew);
          redisee.publish(
            'crud/'+doc.constructor.modelName+(this.wasNew?'/create':'/update'),
            doc
          );
        });
        schema.post('delete', function(doc){
          redisee.publish(
            'crud/'+doc.constructor.modelName+'/delete',
            doc
          );
        });
      });
      AuthRouter(function(e,router){
        if(e) return next(e);
        /*
          Setup the router
          Then load all the models into memory
        */
        var appsdir = path.normalize(__dirname+"/../../apps");
        //So much prettier than what I was doing before
        //Can also make this streamed
        //For now though, I'd prefer just, not.
        //In fact for all of this initialization I'd much rather prefer to do it
        //Synchronously, unfortunately, thats not a thing unless everything is a
        //Child process that I execSync (absurd I know)
        glob(__root+'/apps/*/models{.js,/**/*.js}',function(e,ari){
          if(e) return next(e);
          ari.forEach(require);
          router.use(require(__root+"/apps/node_modules/mongooseRouter"));
          next();
        });
      });
    });
  });
});
