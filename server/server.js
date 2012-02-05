(function() {
  var after, child, childs, every, io, parent, parents;

  after = function(ms, func) {
    return setTimeout(func, ms);
  };

  every = function(ms, func) {
    return setInterval(func, ms);
  };

  io = require('socket.io').listen(1338);

  parent = child = null;

  parents = {};

  childs = {};

  io.sockets.on('connection', function(socket) {
    socket.on('parent', function(name, cb) {
      console.log('registered parent');
      parents[(socket.id.toString()).slice(12)] = socket;
      return cb((socket.id.toString()).slice(12));
    });
    socket.on('child', function(msg) {
      console.log('registered child');
      childs[msg] = socket;
      return childs[msg].on('evt', function(evt) {
        console.log("event!!");
        return parents[msg].emit('evt', evt);
      });
    });
    return socket.on('log', function(msg) {
      return console.log(msg);
    });
  });

}).call(this);