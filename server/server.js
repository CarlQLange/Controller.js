
/*
This is super-simple! All this server does is relate the parents
and the children.

It's got a dict of parents, and a dict of children. The keys in
both are just ids - a child of a parent will have the parent's
id as its key.

When a parent emits 'regevt', its children get told to handle
whetever event type gets passed down along.
Then, whenever that event type happens on the child, the stripped
event is passed up to the parent.

When any socket emits 'log', the server will log a message. This
is for debug purposes only, and it probably shouldn't exist.
*/

(function() {
  var after, childs, io, once, parents;

  io = require('socket.io').listen(1338);

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
    socket.on('child', function(msg, err) {
      if (!(msg in parents)) {
        err();
        return;
      }
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
