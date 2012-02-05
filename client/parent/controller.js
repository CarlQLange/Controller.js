
/*
	this is just a shim between the parent and controller.
	connects to the server,
	keeps event callbacks, calls them when server says to.
*/

(function() {
  var G;

  G = window;

  G.Controller = (function() {

    function Controller() {
      var _this = this;
      console.log("constructed controller");
      G.socket = io.connect('http://127.0.0.1:1338');
      G.socket.emit('log', 'connected parent');
      G.socket.emit('parent', '', function(msg) {
        return alert(msg);
      });
      G.socket.on('evt', function(msg) {
        return _this._on(msg);
      });
      this.callbacks = {};
    }

    Controller.prototype.on = function(type, callback) {
      return this.callbacks[type] = callback;
    };

    Controller.prototype._on = function(evt) {
      return this.callbacks[evt.type](evt);
    };

    return Controller;

  })();

}).call(this);
