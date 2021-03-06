
/*
	this is just a shim between the parent and controller.
	connects to the server,
	keeps event callbacks, calls them when server says to.
*/

(function() {
  var G;

  G = window;

  G.Controller = (function() {

    function Controller(server) {
      var _this = this;
      if (server == null) server = 'http://127.0.0.1:1338';
      G.socket = io.connect(server);
      G.socket.emit('log', 'connected parent');
      G.socket.emit('parent', '', function(msg) {
        _this.id = msg;
        return alert(_this.id);
      });
      G.socket.on('evt', function(msg) {
        return _this._on(msg);
      });
      this.callbacks = {};
    }

    Controller.prototype.on = function(type, callback) {
      this.callbacks[type] = callback;
      return G.socket.emit('regevt', type);
    };

    Controller.prototype._on = function(evt) {
      evt = JSON.parse(evt);
      if (evt.type in this.callbacks) return this.callbacks[evt.type](evt);
    };

    return Controller;

  })();

}).call(this);
