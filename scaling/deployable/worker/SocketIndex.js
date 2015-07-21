

module.exports = function(socket){
  var fn = require(process.env.SCRIPT);
  socket.on("message",function(data){
    data = JSON.parse(data);
    fn(data.data,function(err,ret){
      socket.send(JSON.stringify({id:data.id,error:err,data:data}));
    });
  });
};