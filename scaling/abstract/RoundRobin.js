var async = require('async');
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

WorkerPool.prototype.getWorker = function(next){
  var worker;
  if(this.workers.length === 0){
    if(this.workLength === this.max_workers){
      return next();
    }
    worker = this.createWorker();
    this.workLength++;
  }else{
    //Get the top one
    worker = this.workers.shift();
  }
  next(void 0, worker);
};

Worker.prototype.emptyWorker = function(worker){
  if(_this.workerLength > min_workers){
    _this.destroyWorker(worker);
    _this.workers.splice(_this.workers.indexOf(worker),1);
  }
};

WorkerPool.prototype.createWorker = function(){
  throw new Error('this method createWorker is abstract');
};
WorkerPool.prototype.destroyWorker = function(worker){
  throw new Error('this method destroyWorker is abstract');
};

WorkerPool.prototype.giveWork = function(data,next){
  //If we have no workers available create a new worker
  var _this = this;
  async.waterfall([
    _this.getWorker.bind(this),
    function(worker,next){
      if(arguments.length === 1){
        // add next to queue
        return this.queue.push(worker);
      }
      next(void 0,worker);
    },
    function(worker,next){
      worker.jobs++;
      if(worker.jobs === _this.max_per_worker){
        worker.isMaxed = true;
      }else{
        _this.workers.push(worker);
      }
      worker.giveWork(data,next.bind(void 0,void 0,worker));
    }
  ],function(worker,err,data){
    process.nextTick(function(){
      next(err,data);
    });
    worker.jobs--;
    if(worker.jobs === _this.max_per_worker-1){
      if(_this.queue.length){
        _this.queue.shift()(worker);
      }else{
        _this.workers.push(worker);
      }
    }
    if (worker.jobs === 0) {
      _this.emptyWorker(worker);
    }
  });
};


module.export = WorkerPool;

