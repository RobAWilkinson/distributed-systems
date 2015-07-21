var isIP = /\d{1,3}\.\d{1,3}\.\d{1,3}\d{1,3}/;

module.exports = function(def,req){
  if(isIP.test(req.headers.host)) return def;
  var dom = req.headers.host.split('.')[0];
  if(dom.length === 0) return def;
  return dom[0];
};