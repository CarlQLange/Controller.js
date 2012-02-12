(function() {
  var after, child, childs, io, once, parent, parents;

  io = require('socket.io').listen(1338);

  parent = child = null;

  parents = {};

  childs = {};

  io.sockets.on('connection', function(socket) {
    socket.on('parent', function(name, cb) {
      var id;
      console.log('registered parent');
      id = socket.id.toString().slice(12);
      parents[id] = socket;
      cb(id);
      return parents[id].on('regevt', function(type) {
        return once((function() {
          return id in childs;
        }), function() {
          return childs[id].emit('regevt', type);
        });
      });
    });
    socket.on('child', function(msg) {
      console.log('registered child');
      childs[msg] = socket;
      return childs[msg].on('evt', function(evt) {
        return parents[msg].emit('evt', evt);
      });
    });
    return socket.on('log', function(msg) {
      return console.log(msg);
    });
  });

  after = function(ms, fn) {
    return setTimeout(fn, ms);
  };

  once = function(exp, fn) {
    if (exp()) {
      return fn();
    } else {
      return after(1000, function() {
        return once(exp, fn);
      });
    }
  };

}).call(this);
