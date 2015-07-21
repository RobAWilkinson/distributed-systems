var bouncy = require('bouncy');

module.exports = function(nameport){
  return bouncy(function (req, res, bounce) {
    //Here I'm doing it by subdomain, but That is probably too much
    var hn = req.headers.host.split('.');
    var name;
    console.log(hn);
    if(hn.length === 3){
      if(hn[1] !== 'localhost') return res.end();
      if(!(hn[0] in nameport)) return res.end();
      name = hn[0];
    }else if(hn.length !== 2) return res.end();
    else name = 'static';
    console.log('proxying: ',name,', ',nameport[name]);
    bounce(nameport[name].port);
  });
};
