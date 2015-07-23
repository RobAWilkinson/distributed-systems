//Insert Load Balancer Here

/*

  create 2 Servers
  1) public Facing - HTTP Proxy
  2) Private Facing - TCP/Persistant Connection

  When A Duplicate Comes online
    -It makes a connection to the Load Balancer
    -It sends its own IP Address to the load balancer
    -They communicate over this over the future

  When a new HTTP Requests comes in
    -Find next worker
    -Proxy Request to that worker
*/

var bouncy = require('bouncy');
var ip = require("node-ip");
var url = require('url');

module.exports = function(){

};

function makeFindable(port,name,next){
  require('./finding/findable')(port,'loadBalancer-'+name,next);
}

function createLoadBalancer(loadBalancerPort,findableServer,validRequest,next){
  var workers = [];
  var i = -1;
  var loadBalancer = new ws.Server(findableServer);
  loadBalancer.on("connection",function(ws){
    if(!validRequest(ws.upgradeReq)) return ws.close();
    var port = url.parse(ws.upgradeReq.url,true).query.port;
    if(!port) return ws.close();
    var config = {ip:ws.upgradeReq.connection.remoteAddress,port:port};
    workers.push(config);
    ws.on("close",function(){
      var ii = workers.indexOf(config);
      workers.splice(ii,1);
      if(ii <= i) i--;
    });
    ws.send("hello");
  });

  var server = bouncy(function (req, res, bounce) {
    if(i === -1) return res.end();
    var current = workers[i];
    bounce(current.ip,current.port);
    i = (i+1)%workers.length;
  });
  server.listen(loadBalancerPort,function(){
    console.log("loadBalancer listening on "+ip.address()+":"+loadBalancerPort);
    next();
  });
}

function connectToProxy(proxyPort,name,next){
  scouter(function(text){
    text = text.split('-');
    return text[0] === 'proxy';
  },function(err,ips){
    if(err) throw err;
    if(ips.length === 0){
      throw new Error('no ips found');
    }
    if(ips.length > 1){
      throw new Error('too many ips found');
    }
    var client = new ws("ws://"+ips[0]+":"+proxyPort+"?port="+port+"&name="+name);
    next(void 0,client);
  });
}
