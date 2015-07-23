var gm = require('gm')
var path = require('path');
module.exports = function(obj, next) {
  var filepath = obj.new_path;
  var outputPath = __dirname + '/charcoal/' + path.basename(filepath);
  gm(filepath)
    .flip()
    .magnify()
    .rotate('green', 45)
    .blur(7, 3)
    .edge(3)
    .write(outputPath, function (err) {
      console.log(err);
      if(err) return next(err);
      if (!err) console.log('crazytown has arrived');
      // call next with no error
      next(void(0), outputPath);
    });
};

if(!module.parent) {
  process.on("message", function(data) {
    module.exports(data.filepath, function(err, outputpath) {
      process.send({
        id: data.id,
        err: err,
        outputpath: outputpath
      });
    });
  });
}
