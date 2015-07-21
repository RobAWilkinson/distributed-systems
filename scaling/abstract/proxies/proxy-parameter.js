var url = require("url");

module.exports = function(def,req){
  var path = url.parse(req.url).query.target;
  if(!path) return def;
  if(path === "") return def;
  return def;
};