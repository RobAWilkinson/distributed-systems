var hat = require('hat');

//this process is in charge of managing what workers are working and sending different filepaths to different workers

var workerArray = [];
module.exports = function() {
  // find a worker that doesnt have work
  //
  // send him the new filepath
  this.passtoWorker = function(filepath) {
    for(var i = 0; i < workerArray.length; i++) {
      if(workerArray[i].busy?) {
        continue;
      }
      uniq = hat();
      dataToPass = {
        id: hat(),
        inputPath: filepath
      };
      workerArray[i].send(dataToPass);
      sent = true;
    }
  }


}
