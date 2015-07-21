module.exports = WorkerPool;

function WorkerPool(max_per_worker, min_workers, max_workers){
  this.workers = [];
  this.queue = [];
  this.workerLength  = 0;
  if(typeof max_per_worker === "undefined") max_per_worker = 5;
  if(typeof min_workers === "undefined") min_workers = 1;
  if(typeof max_workers === "undefined") max_workers = Number.POSITIVE_INFINITY;
  this.max_per_worker = max_per_worker;
  this.min_workers = min_workers;
  this.max_workers = max_workers;
}

WorkerPool.prototype.createWorker = function(){
  throw new Error('this method createWorker is abstract');
};
WorkerPool.prototype.destroyWorker = function(worker){
  throw new Error('this method destroyWorker is abstract');
};

WorkerPool.prototype.giveWork = function(data,next){
  var worker;
  //If we have no workers available create a new worker
  if(this.workers.length === 0){
    if(this.workLength === this.max_workers){
      return this.queue.push({data:data,next:next});
    }
    worker = this.createWorker();
    this.workLength++;
  }else{
    //Get the top one
    worker = this.workers.shift();
  }
  var _this = this;
  worker.giveWork(data,function(err,data){
    if(worker.isMaxed){
      if(_this.queue.length){
        var work = _this.queue.shift();
        return worker.giveWork(work.data,work.length);
      }
      _this.workers.push(worker);
      worker.isMaxed = false;
    }else if (worker.workLength === 0) {
      if(_this.workerLength > min_workers){
        _this.destroyWorker(worker);
        _this.workers.splice(_this.workers.indexOf(worker),1);
      }
    }
    next(err,data);
  });

  if(worker.workLength === this.max_per_worker){
    worker.isMaxed = true;
  }else{
    this.workers.push(worker);
  }
};


module.export = WorkerPool;

