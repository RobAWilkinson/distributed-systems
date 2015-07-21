

var fn = require(process.env.SCRIPT);

process.on("message",function(data){
  fn(data.data,function(err,ret){
    process.send({id:data.id,error:err,data:data});
  });
});
