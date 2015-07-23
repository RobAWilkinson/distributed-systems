var ws = require("ws");
var scouter = require("../utils/scouter");
module.exports = function(file,port,name,loadBalancerPort){
  role = role.split('-');
  scouter(function(text){
    text = text.split('-');
    return text[0] === 'loadBalancer' && text[1] === role[1];
  },function(err,ips){
    if(err) throw err;
    if(ips.length === 0){
      throw new Error('no ips found');
    }
    if(ips.length > 1){
      throw new Error('too many ips found');
    }
    require(file)(port,function(){
      var client = new ws("ws://"+ips[0]+":"+loadBalancerPort+"?port="+port);
    });
  });
};