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
  var _this = this;
  var worker;
  for(var i=0,l=this.workers.length;i<l;i++){
    worker = this.workers[i];
    if(worker.workLength === this.max_per_worker) continue;
    return this.giveWorkToWorker(worker,data,next);
  }
  if(this.workers.length === this.max_workers){
    return this.queue.push({data:data,next:next});
  }
  worker = this.createWorker();
  this.workers.push(worker);
  this.giveWorkToWorker(worker,data,next);
};

WorkerPool.prototype.giveWorkToWorker = function(worker,data,next){
  var _this = this;
  return worker.giveWork(data,function(err,data){
    if(_this.queue.length){
      var work = _this.queue.shift();
      worker.giveWork(work.data,work.next);
    }else if(worker.workLength === 0){
      if(_this.workers.length > _this.min_workers){
        _this.destroyWorker(worker);
        _this.workers.splice(_this.workers.indexOf(worker),1);
      }
    }
    next(err,data);
  });
};


module.export = WorkerPool;

