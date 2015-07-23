var async = require('async');

var map = {};

module.exports = 	function(moduleContext,path,next){
  var resolvedPath = moduleContext.require.resolve(path);
  if(!(resolvedPath in map)){
    map[resolvedPath] = require(resolvedPath);
  }
  map[resolvedPath](next);
};
