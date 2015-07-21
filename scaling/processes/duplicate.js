var cluster = require('cluster');
var async = require('async');

module.exports = function(service, settings){
  cluster.setupMaster({
    args: ['service',service].concat(settings),
    env:{NODE_ENV:process.env.NODE_ENV}
  });
  var numCPUs = require('os').cpus().length;
  // Fork workers.
  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
    throw new Error('worker died');
  });
  var ii = 0;
  cluster.on('fork', function(worker) {
    console.log('worker ' + worker.process.pid + ' started');
    worker.on('message',function(mess){
      if(mess === 'ready') ii++;
      if(ii === numCPUs){
        process.send('ready');
      }
    });
  });
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
};
