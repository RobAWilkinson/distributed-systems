var bouncy = require('bouncy');

module.exports = function(nameport,parser){
  return bouncy(function (req, res, bounce) {
    var name = parser(req);
    if(!(name in nameport)) return res.end();
    bounce(nameport[name].host,nameport[name].port);
  });
};
