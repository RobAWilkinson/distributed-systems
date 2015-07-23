
/*

  Requires Redis EventEmitter

*/

var config = require('getconfig');
var utils = require('../utils.js');
var async = require('async');
module.exports = utils.asyncCachable(function(next){
  var mongoose = require("mongoose");
  if(config.db.debug){
    mongoose.set("debug", true);
  }

  mongoose.connect(config.db.url, config.db.options);
  var erlist,oplist;
  mongoose.connection.once( "error", erlist = function(err){
    mongoose.connection.removeListener("open",oplist);
    console.error("Database Error");
    next(err);
  });
  mongoose.connection.once( "open", oplist = function(err){
    mongoose.connection.removeListener("error",erlist);
    console.log("Database used "+config.db.url);
    var Grid = require('gridfs-stream');
    mongoose.gfs = Grid(mongoose.connection.db, mongoose.mongo);
    var mpath = require('mpath');
    mongoose.plugin(function(schema){
      var stringPaths = Object.keys(schema.paths).filter(function(path){
        return schema.paths[path].instance === 'string' ||
          (schema.paths[path].caster && schema.paths[path].caster.instance === 'string');
      });
      schema.post('delete', function(doc){
        stringPaths.forEach(function(path){
          var val = mpath.get(doc,path);
          if(!Array.isArray(val)) val = [val];
          async.each(val,function(str,next,index){
            if(!/^gridfs\:\/\//.test(str)) return next();
            var id = str.substring(9);
            mongoose.gfs.remove({
              _id: id, // a MongoDb ObjectId
              root: doc.constructor.modelName
            },function (err) {
              if (err) return next(err);
              console.log('deleted a gfs artifact',id);
              next();
            });
          },function(e){
            if(e) return console.error(e);
            console.log('deleted artifacts');
          });
        });
      });
    });
    next(void 0, mongoose);
  });
});