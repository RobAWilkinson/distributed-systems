var express = require('express'),
    http = require('http'),
    formidable = require('formidable'),
    fs = require('fs'),
    path = require('path');
var spawn = require('child_process').spawn;
var RoundRobin = require('./RoundRobin');

var gm = require('gm')
var app = express();

var manager = new RoundRobin(1);
// All your express server code goes here.
// ...
app.use(express.static(__dirname + '/public'));

// Upload route.
app.post('/upload', function(req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    // `file` is the name of the <input> field of type `file`
    var old_path = files.file.path;
    var file_size = files.file.size;
    var file_ext = files.file.name.split('.').pop();
    var index = old_path.lastIndexOf('/') + 1;
    var file_name = old_path.substr(index);
    var new_path = path.join(process.env.PWD, '/uploads/', file_name + '.' + file_ext);
    fs.readFile(old_path, function(err, data) {
      fs.writeFile(new_path, data, function(err) {
        fs.unlink(old_path, function(err) {
          var data = {
            new_path: new_path
          };
          manager.giveWork(data, function(err, outputpath){
            if (err) {
              res.status(500);
              res.json({'success': false});
            } else {
              res.status(200);
              res.json({'success': true});
            }


          }); 

        });
      });
    });
  });
});
app.listen(3000)
