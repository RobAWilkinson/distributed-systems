var server = require('ws')();

var listeners = [];

server.on("connection",function(ws){
  listeners.push(ws);
  ws.on('message',function(message){
    listeners.forEach(function(list){
      list.send(message);
    });
  });
});

ws.listen(process.env.PORT);
