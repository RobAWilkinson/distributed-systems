/*
  We will not need...
  1) A proxy
  2) A load balancer
*/

var fs = require('fs');
fs.readdirSync('../public-services').forEach(function(name){
  require('../public-services/'+name);
});
