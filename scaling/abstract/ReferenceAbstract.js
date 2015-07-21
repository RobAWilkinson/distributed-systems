module.exports = ReferenceAbstract;

function ReferenceAbstract(){
  this.current_work = {};
}

ReferenceAbstract.prototype.giveWork = function(data,next){
  var id = Math.random().toString("32").substring(2);
  this.current_work[id] = {
    id:id,
    cb:next
  };
  return {id:id,data:data};
};

ReferenceAbstract.prototype.returnMessage = function(event){
  if(!(event.id in this.current_work)){
    throw new Error("non-existant event-id:",event);
  }
  this.current_work[event.id].cb(event.error,event.data);
};

Object.defineOwnProperty(ReferenceAbstract.prototype,"workLength",{
  get: function(){
    return Object.keys(this.current_work).length;
  }
});
