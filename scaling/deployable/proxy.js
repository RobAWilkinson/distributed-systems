//Insert Load Balancer Here

/*

  create 2 Servers
  1) public Facing - HTTP Proxy
  2) Private Facing - TCP/Persistant Connection

  When A Duplicate Comes online
    -It makes a connection to the proxy
    -It sends its own IP Address to the proxy
    -It sends the subdomain/Route that the proxy should watch for

  When a new HTTP Requests comes in
    -Find routes
    -Make request on behalf
*/

//Insert Load Balancer Here

var bouncy = require('bouncy');
var RoundRobin = require("../abstract/RoundRobin");
var ip = require("node-ip");
var url = require('url');
module.exports =

function makeFindable(port,name,next){
  require('./finding/findable')(port,'proxy',next);
};

function createProxyServer(proxyPort,workerServer,validRequest,nameParser,next){
  var namedWorkers = {};
  var proxyListener = new ws.Server(workerServer);
  proxyListener.on("connection",function(ws){
    if(!validRequest(ws.upgradeReq)) return ws.close();
    var uri = url.parse(ws.upgradeReq.url,true);
    var port = uri.query.port;
    if(!port) return ws.close();
    var name = uri.query.name;
    if(!name) return ws.close();
    if(name in namedWorkers) return ws.close();
    var config = {
      ip:ws.upgradeReq.connection.remoteAddress,
      port:port,
      name:name
    };
    namedWorkers[name] = config;
    workers.push(config);
    ws.on("close",function(){
      delete namedWorkers[name];
    });
    ws.send("hello");
  });

  var server = bouncy(function (req, res, bounce) {
    var name = parser(req);
    if(!(name in nameport)) return res.end();
    bounce(nameport[name].host,nameport[name].port);
  });
  server.listen(proxyPort,function(){
    console.log("proxy Server listening on "+ip.address()+":"+proxyPort);
    next();
  });
}
