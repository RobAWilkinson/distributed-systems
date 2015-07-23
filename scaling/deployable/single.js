var ws = require("ws");
var scouter = require("../utils/scouter");

function connectToProxy(file,proxyPort,port,name,next){
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
    require(file)(port,function(){
      var client = new ws("ws://"+ips[0]+":"+proxyPort+"?port="+port+"&name="+name);
      next(void 0,client);
    });
  });
}