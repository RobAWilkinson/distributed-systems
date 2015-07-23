var RefAbs = require("../ReferenceAbstract");
var bounce = require("bouncy");
module.exports = WorkerReference;

function SocketReference(socket){
  if(!(this instanceof WorkerReference)) return new SocketReference();
  RefAbs.call(this);
  this.socket = socket;
  this.socket.on("message",this.returnMessage.bind(this));
}

SocketReference.prototype = Object.create(RefAbs.prototype);
SocketReference.prototype.constructor = SocketReference;

SocketReference.prototype.giveWork = function(data,next){
  this.socket.send(RefAbs.prototype.giveWork.call(this,data,next));
};
