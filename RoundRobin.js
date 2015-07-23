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
      // if there are no workers available and we are maxed out on workers, just return the next function
      return next();
    }
    // otherwise create a new worker and increase the count of workers
    worker = this.createWorker();
    this.workLength++;
  }else{
    // workers are available
    //Get the top one
    worker = this.workers.shift();
  }
  // next expects an error and a worker
  next(void 0, worker);
};

Worker.prototype.emptyWorker = function(worker){
  if(this.workerLength > min_workers){
    this.destroyWorker(worker);
    this.workers.splice(_this.workers.indexOf(worker),1);
  }
};
// Worker needs a method givework that takes a few arguments
// data, and next
//
WorkerPool.prototype.createWorker = function(){

  throw new Error('this method createWorker is abstract');
};
WorkerPool.prototype.destroyWorker = function(worker){
  throw new Error('this method destroyWorker is abstract');
};

// 
WorkerPool.prototype.giveWork = function(data,done){
  //If we have no workers available create a new worker
  var _this = this;
  async.waterfall([
      // async automatically passes next into each function as the last parameter
    _this.getWorker.bind(this),
    // next now has a worker as its second argument if one is available cf. getWorker func above
    function(){
      // this function is in charge of handling the workqueue if workers are full
      if(arguments.length === 1){
        // meaning there are no workers
        var next = arguments[0];
        // add next to queue
        // adding this work to the queue it will be unshifted below and passed into the next available worker
        return this.queue.push(next);
      }
      // REMEMBER, NEXT IS LAST
      var next = arguments[1];
      var worker = arguments[0];
      // no error
      next(void 0,worker);
    }.bind(this),
    function(worker,next){
      // this function always needs worker
      worker.jobs++;
      if(worker.jobs === _this.max_per_worker){
        // if the new job maxes out the worker
        worker.isMaxed = true;
      }else{
        // allow it to be used again
        this.workers.push(worker);
      }
      // throw the data at that worker give nothing to next
      // next called in a void execution context and is passed (void 0, worker)
      worker.giveWork(data, next.bind(void 0,void 0,worker) );
    }.bind(this)
  ],function(realError, worker,returnedError,returnedData){
    process.nextTick(function(){
      //  go again
      done(returnedError,returnedData);
    });
    // take away a worker job count
    worker.jobs--;
    if(worker.jobs === _this.max_per_worker-1){
      //  that lazy ass worker has a fuckin job available
      //  this is falsey at zero
      if(_this.queue.length > 0){
        // give that job to that lazy bitch
        var job = _this.queue.shift();
        job(void 0, worker);
      }else{
        // nothing for that worker to do, so toss him back in the pool
        _this.workers.push(worker);
      }
    }
    if (worker.jobs === 0) {
      // that worker has no jobs available so call empty worker to kill the process and clear memory dalloc
      _this.emptyWorker(worker);
    }
  });
};


module.export = WorkerPool;

