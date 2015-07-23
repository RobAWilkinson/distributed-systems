var gm = require('gm')
var path = require('path');
module.exports = function(filepath, next) {
  var startTime = new Date();
  var outputPath = __dirname + '/charcoal/' + path.basename(filepath);
  gm(file_path)
    .flip()
    .magnify()
    .rotate('green', 45)
    .blur(7, 3)
    .edge(3)
    .write(outputPath, function (err) {
      if(err) return next(err);
      if (!err) console.log('crazytown has arrived');
      next(void(0), outputPath);
    });
};

if(!module.parent) {
  process.on("message", function(data) {
    module.exports( data.filepath, function(err, outputpath) {
      process.send({
        id: data.id,
        err: err,
        outputpath: outputpath
      });
    });
  });
}
