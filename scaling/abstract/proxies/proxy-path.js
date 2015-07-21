var url = require("url");

var isIndex = /^\/?$/;

module.exports = function(def,req){
  if(isIndex.test(req.url)) return def;
  var dom = url.parse(req.url).path.split("/")[0];
  if(dom[0] === "") return def;
  return dom[0];
};