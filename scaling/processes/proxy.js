

var config = require('getconfig');
var async = require('async');
var fs = require('fs');
var processes = fs.readdirSync(__dirname+'/../micro-processes').map(stripJs);
var cp = require('child_process');

/*

  1) Each instance will know about nobody else
    -Except for the "person" that started it
  2) Need to pass on configuration
    -Need to specify the type of service

*/

/*
  We will not need...
  1) A proxy
  2) A load balancer
*/


var fs = require('fs');

var statics = [];
var port = config.http.port || 8080;
var nameport = {};

async.each(fs.readdirSync('../public-services'),function(name,next){
  require('../public-services/'+name);
  startProcess(name,temp,++port,statics,function(e,child){
    nameport[name.substring(0,name.length-3)] = {port:port,child:child};
  });
},function(e){
  if(e) throw e;
  var server = require('../abstract/proxy')(nameport);
  server.listen(config.http.port);
});




function startProcess(config,port,others,next){
  var args = [
    config.load_balanced?'vertical':'service',
    name,
    'http.port='+port
  ].concat(others.map(function(item){
    //need to make sure that any services that are required by other services
    return item.name+'.ip='+item.ip;
  }));
  var child = cp.fork(__dirname+'/../index.js',args);
  var cl, el;
  child.once('error', el = function(e){
    child.removeListener('message',cl);
    next(e);
  });
  child.once('message',cl = function(mess){
    child.removeListener('error',el);
    if(mess === 'ready') next(void 0,child);
    else next(mess);
  });
}

