var express = require('express'),
    http = require('http'),
    formidable = require('formidable'),
    fs = require('fs'),
    path = require('path');
var spawn = require('child_process').spawn;

var gm = require('gm')
var app = express();

// All your express server code goes here.
// ...
app.use(express.static(__dirname + '/public'));

// Upload route.
app.post('/upload', function(req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    // `file` is the name of the <input> field of type `file`
    var old_path = files.file.path,
    file_size = files.file.size,
    file_ext = files.file.name.split('.').pop(),
    index = old_path.lastIndexOf('/') + 1,
    file_name = old_path.substr(index),
    new_path = path.join(process.env.PWD, '/uploads/', file_name + '.' + file_ext);
    fs.readFile(old_path, function(err, data) {
      fs.writeFile(new_path, data, function(err) {
        fs.unlink(old_path, function(err) {
          spawn('./worker.js', new_path);
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
app.listen(3000)
