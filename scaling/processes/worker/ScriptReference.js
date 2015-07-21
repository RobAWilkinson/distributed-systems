var cp = require('child_process');
var RefAbs = require("../ReferenceAbstract");
var path = require("path");

module.exports = WorkerReference;

function WorkerReference(script){
  if(!(this instanceof WorkerReference)) return new WorkerReference();
  RefAbs.call(this);
  this.process = cp.fork(__dirname+"/ScriptIndex.js",{cwd:path.resolve(this.script,".."),env:{SCRIPT:this.script}});
  this.process.on("message",this.returnMessage.bind(this));
}

WorkerReference.prototype = Object.create(RefAbs.prototype);
WorkerReference.prototype.constructor = WorkerReference;

WorkerReference.prototype.giveWork = function(data,next){
  this.process.send(RefAbs.prototype.giveWork.call(this,data,next));
};
