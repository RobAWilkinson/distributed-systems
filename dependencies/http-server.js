var http = require("http");
module.exports = function(port, next){
  var server = new http.Server();
  server.once("error",next);
  server.listen(port,function(){
    server.removeListener("error",next);
    next(void 0,server);
  });
};